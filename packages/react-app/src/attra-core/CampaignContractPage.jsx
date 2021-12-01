import { Button, Card, Input, Typography, Form, notification } from "antd";
import { useMemo, useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { getEllipsisTxt } from "helpers/formatters";
import { useEffect } from "react";
import { getNonDeployedContract } from "helpers/getNonDeployedContract";

const { Text } = Typography;

const styles = {
  rowStyle : {
    margin: "auto", display: "flex", gap: "20px", 
          marginTop: "25"
  }
}

const contractName = "AttraCampaign";

export default function CampaignContractPage(provider) {
  const { Moralis } = useMoralis();
  
  const abi = getNonDeployedContract[contractName];
  const [responses, setResponses] = useState({});
  const [inputAddress, setInputAddress] = useState("");
  const [contractAddress, setContractAddress] = useState("");

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
    <div style={{ margin: "auto", marginTop: "25", width: "800px" }}>
      <div style={styles.rowStyle}>
        <Form style={{width: "60%"}}>
          <Card size="small"
              style={{
                boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
                border: "1px solid #e7eaf3",
                borderRadius: "0.5rem",
              }}
            >
              <Form layout="horizontal">
                <Form.Item
                  name="Address"
                  style={{ marginBottom: "15px" }}
                >
                  <Input placeholder="Campaign Address" onInput={(ev) => setContractAddress(ev.target.value)}/>
                  <Button style={{marginTop: '1rem', float: 'right'}}
                    type="primary"
                    onClick={() => {setInputAddress(contractAddress)}}
                  >
                    Load
                  </Button>
                </Form.Item>
              </Form>
          </Card>
        </Form>
        <div style={{width: "40%"}}>&nbsp;</div>
      </div>
      <br/>
      <div style={styles.rowStyle}>
        <Card
          title={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              Create a Campaign
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

              const options = {
                contractAddress,
                functionName: name,
                abi,
                params,
              };

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
    </div>
  );
}
