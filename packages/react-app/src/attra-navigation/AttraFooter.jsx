import { Layout } from "antd";
import Text from "antd/lib/typography/Text";
import './AttraFooter.css';
const { Footer } = Layout;

const AttraFooter = () => (
  <Footer className="footer">
    <Text className="footer-text">
      Check out the project on {" "}
      <a
        href="https://github.com/ethereum-boilerplate/ethereum-boilerplate/"
        target="_blank"
        rel="noopener noreferrer"
      >
        DEVPOST 
      </a>
    </Text>

    <Text className="footer-text">
      You have questions? DM me on Twitter {""}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://twitter.com/messages/compose?recipient_id=1347938190385172486"
        data-screen-name="@nubius_d"
      >
        @nubius_d
      </a>
    </Text>
  </Footer>
);

export default AttraFooter;