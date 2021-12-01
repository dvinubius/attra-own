import { Button, Card, Input, Typography, Form, notification } from "antd";
import { useMemo, useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { getEllipsisTxt } from "helpers/formatters";
import { useEffect } from "react";
import { getDeployedContract } from "helpers/getDeployedContract";
import Address from "components/Address/Address";
const { Text } = Typography;

const contractName = "AttraFinance";

export default function AttraContractPage() {
  const { Moralis } = useMoralis();
  const { contractAddress, abi } = getDeployedContract(contractName);
  const [responses, setResponses] = useState({});

  /**Live query */
  const { data } = useMoralisQuery("Events", (query) => query, [], {
    live: true,
  });             

  useEffect(() => console.log("New data: ", data), [data]);

  const displayedContractFunctions = useMemo(() => {
    if (!abi) return [];
    return abi.filter((method) => method["type"] === 'function');
  }, [abi]);

    const openNotification = ({ message, description }) => {
      notification.open({
        placement: "bottomRight",
        message,
        description,
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
    };

  return (
    <div style={{ margin: "auto", display: "flex", gap: "20px", marginTop: "25", width: "70vw" }}>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {contractName}
            <Address avatar="left" copyable address={contractAddress} size={8} />
          </div>
        }
        size="large"
        style={{
          width: "60%",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
        }}
      >
        <Form.Provider
          onFormFinish={async (name, { forms }) => {
            const params = forms[name].getFieldsValue();

            let isView = false;

            for (let method of abi) {
              if (method.name !== name) continue;
              if (method.stateMutability === "view") isView = true;
            }

            const options = {
              address: contractAddress,
              functionName: name,
              abi,
              params,
            };

            if (!isView) {
              const tx = await Moralis.executeFunction({ awaitReceipt: false, ...options });
              tx.on("transactionHash", (hash) => {
                setResponses({ ...responses, [name]: { result: null, isLoading: true } });
                openNotification({
                  message: "🔊 New Transaction",
                  description: `${hash}`,
                });
                console.log("🔊 New Transaction", hash);
              })
                .on("receipt", (receipt) => {
                  setResponses({ ...responses, [name]: { result: null, isLoading: false } });
                  openNotification({
                    message: "📃 New Receipt",
                    description: `${receipt.transactionHash}`,
                  });
                  console.log("🔊 New Receipt: ", receipt);
                })
                .on("error", (error) => {
                  console.log(error);
                });
            } else {
                Moralis.executeFunction(options).then((response) => {
                  setResponses({ ...responses, [name]: { result: response, isLoading: false } })
                }
              );
            }   
          }}
        >
          {displayedContractFunctions &&
            displayedContractFunctions.map((item, mKey) => (
              <Card size="small"
                title={`${mKey + 1}. ${item?.name}`}
                style={{ marginBottom: "20px" }}
                key={mKey}
              >
                <Form layout="vertical" name={`${item.name}`}>
                  {item.inputs.map((input, key) => (
                    <Form.Item
                      label={`${input.name} (${input.type})`}
                      name={`${input.name}`}
                      required
                      style={{ marginBottom: "15px" }}
                      key={key}
                    >
                      <Input placeholder="input placeholder" />
                    </Form.Item>
                  ))}
                  <Form.Item style={{ marginBottom: "5px" }}>
                    <Text style={{ display: "block" }}>
                      {responses[item.name]?.result &&
                        `Response: ${JSON.stringify(responses[item.name]?.result)}`}
                    </Text>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={responses[item?.name]?.isLoading}
                    >
                      {item.stateMutability === "view" ? "Read🔎" : "Create"}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            ))}
        </Form.Provider>
      </Card>
      <Card
        title={"Contract Events"}
        size="large"
        style={{
          width: "40%",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
        }}
      >
        {data.map((event, key) => (
          <Card title={"Transfer event"} size="small" style={{ marginBottom: "20px" }}>
            {getEllipsisTxt(event.attributes.transaction_hash, 14)}
          </Card>
        ))}
      </Card>
    </div>
  );
}
