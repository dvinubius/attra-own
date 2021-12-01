import { Switch, Route, Redirect } from "react-router-dom";
import RoadmapPage from "../attra-hey-there/RoadmapPage";
import HomePage from "../attra-hey-there/HomePage";
import CampaignsPage from "../attra-core/campaigns/CampaignsPage";
import AttraContractPage from "../attra-core/AttraContractPage";
import CampaignContractPage from "../attra-core/CampaignContractPage";
import './AttraContent.css';

const AttraContent = () => {
  return (
    <div className="AttraContent">
          <Switch>
            <Route path="/home">
              <HomePage />
            </Route>

            <Route path="/campaigns">
              <CampaignsPage />
            </Route>

            <Route path="/attra-contract">
              <AttraContractPage />
            </Route>

            <Route path="/campaign-contract">
              <CampaignContractPage />
            </Route>

            <Route path="/roadmap">
              <RoadmapPage/>
            </Route>
    
            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
            </Route>
          </Switch>
          <Redirect to="/home" />
        </div>
  );
}

export default AttraContent;