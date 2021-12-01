import { useEffect } from "react";
import { useState } from "react";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { getEllipsisTxt } from "../../helpers/formatters";
import Blockie from "../Blockie";
import "./Address.css";

const styles = {
  address: {
    padding: "0 6px",
    height: "36px",
    display: "flex",
    gap: "5px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "9px",
    alignItems: "center",
  },
};

function Address(props) {
  const { walletAddress } = useMoralisDapp();
  const [address, setAddress] = useState();
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    setAddress(props?.address || walletAddress);
  }, [walletAddress, props]);

  if (!address) return null;

  const Copy = () => (
    <svg
      className="copy-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#1780FF"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ cursor: "pointer" }}
      onClick={(ev) => {
        navigator.clipboard.writeText(address);
        setIsClicked(true);
        ev.stopPropagation();
      }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 3v4a1 1 0 0 0 1 1h4" />
      <path d="M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2z" />
      <path d="M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
      <title id="copy-address">Copy Address</title>
    </svg>
  );

  const etherscanUrl = props.address.length === 42
  ?`https://rinkeby.etherscan.io/address/${props.address}`
  : `https://rinkeby.etherscan.io/tx/${props.address}`;

  const ExploreLink = () => (
    <div className="explore-link">
      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        strokeWidth="2"
        stroke="#1780FF"
        fill="#1780FF"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="link-icon"
        onClick={(ev) => {
          window.open(etherscanUrl, "_blank");
          ev.stopPropagation();
        }}>
        <path d="M487.6 90.6l-66.2-66.2c-9.3-10.5-39.1-24.2-64.6 0L241.7 139.6c-17.8 17.8-17.8 46.8 0 64.6l19.2 19.2-37.5 37.6-19.2-19.2c-8.6-8.6-35.7-25.1-64.6 0L24.4 356.9c-17.8 17.8-17.8 46.8 0 64.6l66.2 66.2c22.7 22.7 52.4 12.1 64.6 0l115.2-115.2c17.8-17.8 17.8-46.8 0-64.6l-19.2-19.2 37.6-37.6 19.2 19.2c27.7 23.8 53.5 11 64.6 0l115.2-115.2c17.6-17.7 17.6-46.7-.2-64.5zm-245 245c2.5 2.5 2.5 6.6 0 9.1L127.4 459.9c-2.5 2.5-6.3 2.9-9.1 0l-66.2-66.2c-2.5-2.5-2.5-6.6 0-9.1l115.2-115.2c3.1-3.1 7.1-2 9.1 0l19.2 19.2-32.5 32.5c-7.7 7.7-7.7 20.1 0 27.7 3.8 3.8 17.3 10.4 27.7 0l32.5-32.5 19.3 19.3zm217.3-208.1L344.7 242.6c-2.5 2.5-6.3 2.9-9.1 0l-19.2-19.2 32.5-32.5c7.7-7.7 7.7-20.1 0-27.7-7.7-7.7-20.1-7.7-27.7 0l-32.5 32.5-19.2-19.2c-2.5-2.5-2.5-6.6 0-9.1L384.6 52.2c3.1-3.1 7.1-2.1 9.1 0l66.2 66.2c2.5 2.5 2.5 6.6 0 9.1z" />
        <title id="copied-address">Verify on Etherscan</title>
      </svg>
    </div>
  );

  return (
    <div style={styles.address} className="Address">
      {props.avatar === "left" && <Blockie address={address} size={7} />}
      <p className="mono">{props.size ? getEllipsisTxt(address, props.size) : address}</p>
      {props.avatar === "right" && <Blockie address={address} size={7} />}
      {props.copyable && (isClicked ? <Check /> : <Copy />)}
      {props.linked && <ExploreLink/>}
    </div>
  );
}

export default Address;

const Check = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="3"
    stroke="var(--primary-col)"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    onClick={(ev) => ev.stopPropagation()}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 12l5 5l10 -10" />
    <title id="copied-address">Copied!</title>
  </svg>
);