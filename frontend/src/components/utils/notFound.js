import React from "react";
import { Message } from "semantic-ui-react";
class NotFound extends React.Component {
  render() {
    return (
      <div id="not-found">
        <Message
          error
          className="rtl"
          icon="search"
          header="نتیجه ای یافت نشد"
          content="لطفا پس از بررسی دوباره امتحان کنید"
        />
      </div>
    );
  }
}
export default NotFound;
