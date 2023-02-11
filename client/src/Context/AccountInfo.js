import React, { Component, createContext } from 'react';

export const AccountInfoContext = createContext();

class AccountInfoProvider extends Component {
    state = {
        instancesLoaded: false
    }

    updateAccountInfo = (updatedData) =>{
        for (const [key, value] of Object.entries(updatedData)) {
            this.setState(prevState=>({
                ...prevState,
                [key]: value
            }))
        }
    }

    render(){
        return(
            <AccountInfoContext.Provider 
                value={{
                    ...this.state, 
                    updateAccountInfo: this.updateAccountInfo,
                    }}>
                {this.props.children}
            </AccountInfoContext.Provider>
        )
    }

}
export default AccountInfoProvider;