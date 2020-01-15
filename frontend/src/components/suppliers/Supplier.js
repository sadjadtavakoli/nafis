import React, { Component } from "react";

class Supplier extends Component {
  componentDidMount() {
    console.log("MOUNTED");
  }
  render() {
    return (
      <div>
        <h1>THE SUPPLIER</h1>
      </div>
    );
  }
}

export default Supplier;
