import React, {useContext} from "react";
import { AccountInfoContext } from "../Context/AccountInfo";

function ConnexionStatus() {

    let accountInfo = useContext(AccountInfoContext)
        return(
            <React.Fragment>
            <span id='connexion_info'><small>Contract address <b><a className="etherscan_link" target="_blank" rel="noopener noreferrer" href={"https://etherscan.io/address/"+accountInfo.contractAddress}>{accountInfo.contractAddress}</a></b></small></span><br/>
            <span id='connexion_info'><small>Minting contract address <b><a className="etherscan_link" target="_blank" rel="noopener noreferrer" href={"https://etherscan.io/address/"+accountInfo.mintContractAddress}>{accountInfo.mintContractAddress}</a></b></small></span><br/>
            </React.Fragment>
        )
}

export default ConnexionStatus;