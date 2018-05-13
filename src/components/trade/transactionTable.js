import React from 'react';

const TransactionTable = (props) => {
    return (
        <div className="col col-sm-7">
            <div className="headerTable">
                <table className="table" style={{margin: "0"}}>
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">First</th>
                    <th scope="col">Last</th>
                    <th scope="col">Handle</th>
                </tr>
                </thead>
                </table>
            </div>
            <div className="col col-sm-12 tableBody">
                <table className="table">
                <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>Larry the Bird</td>
                    <td>@twitter</td>
                </tr>
                </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionTable;