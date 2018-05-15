import React from 'react';

const TransactionTable = (props) => {
    return (
        <div className="col col-sm-12">
            <div className="headerTable">
                <table className="table" style={{margin: "0", textAlign: "center"}}>
                <thead>
                <tr>
                    <th scope="col">Token</th>
                    <th scope="col">Strike</th>
                    <th scope="col">Expiration</th>
                    <th scope="col">Put / call</th>
                    <th scope="col">Reserve</th>
                </tr>
                </thead>
                </table>
            </div>
            <div className="col col-sm-12 tableBody" style={{textAlign: "center", padding: "0"}}>
                <table className="table">
                <tbody>
                <tr>
                    <td>Token</td>
                    <td>Strike</td>
                    <td>Expiration</td>
                    <td>Put / call</td>
                    <td>Reserve</td>
                </tr>
                <tr>
                    <td>Token</td>
                    <td>Strike</td>
                    <td>Expiration</td>
                    <td>Put / call</td>
                    <td>Reserve</td>
                </tr>
                <tr>
                    <td>Token</td>
                    <td>Strike</td>
                    <td>Expiration</td>
                    <td>Put / call</td>
                    <td>Reserve</td>
                </tr>
                </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionTable;