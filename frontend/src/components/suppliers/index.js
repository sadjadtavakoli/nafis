import React, { Component } from "react";
import { connect } from "react-redux";
import { getSuppliersAction } from "../../actions/SuppliersActions";

class Suppliers extends Component {
  componentDidMount() {
    this.props.getSuppliersAction();
  }

  componentDidUpdate() {
    console.log(this.props.suppliers);
  }

  render() {
    return (
      <div>
        <h1>suppliers</h1>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    suppliers: state.suppliers
  };
};

export default connect(mapStateToProps, { getSuppliersAction })(Suppliers);
