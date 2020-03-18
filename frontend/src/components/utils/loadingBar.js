import React from "react";
import { Segment, Loader, Dimmer, Image } from "semantic-ui-react";
import paragraph from "../../assets/paragraph.png";

class LoadingBar extends React.Component {
  render() {
    return (
      <Segment>
        <Dimmer active inverted>
          <Loader size="large">
            <span>در حال بارگذاری</span>
          </Loader>
        </Dimmer>

        <Image src={paragraph} />
      </Segment>
    );
  }
}

export default LoadingBar;
