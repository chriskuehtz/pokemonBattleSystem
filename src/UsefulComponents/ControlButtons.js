import React from "react";
import { Button } from "reactstrap";
import Repeatable from "react-repeatable";

class ControlButtons extends React.Component {
  render() {
    let tilesize = this.props.tilesize;
    const interval = 400;

    return (
      <div
        onKeyDown={() => {
          console.log("key pressed");
        }}
      >
        <Repeatable
          repeatDelay={interval}
          repeatInterval={interval}
          onHoldStart={() => this.props.UpFunction()}
          onHold={() => this.props.UpFunction()}
          onClick={() => this.props.UpFunction()}
          onHoldEnd={() => {
            // Callback fired once after the last hold action.
          }}
          onRelease={(event) => {
            // Callback fired when the mouseup, touchcancel, or touchend event is triggered.
          }}
        >
          <Button //UP:
            outline
            color="danger"
            style={{
              zIndex: 1000,
              borderRadiusBottomLeft: 0,
              borderRadiusBottomRight: 0,
              position: "absolute",
              bottom: tilesize * 3,
              left: tilesize * 2,
              width: tilesize,
              height: tilesize,
            }}
          >
            ^
          </Button>
        </Repeatable>
        <Repeatable
          repeatDelay={interval}
          repeatInterval={interval}
          onHoldStart={() => this.props.RightFunction()}
          onHold={() => this.props.RightFunction()}
          onClick={() => this.props.RightFunction()}
          onHoldEnd={() => {
            // Callback fired once after the last hold action.
          }}
          onRelease={(event) => {
            // Callback fired when the mouseup, touchcancel, or touchend event is triggered.
          }}
        >
          <Button //RIGHT:
            outline
            color="danger"
            style={{
              zIndex: 1000,
              borderRadiusTopLeft: 0,
              borderRadiusBottomLeft: 0,
              position: "absolute",
              bottom: tilesize * 2,
              left: tilesize * 3,
              width: tilesize,
              height: tilesize,
            }}
          >
            {">"}
          </Button>
        </Repeatable>
        <Repeatable
          repeatDelay={interval}
          repeatInterval={interval}
          onHoldStart={() => this.props.DownFunction()}
          onHold={() => this.props.DownFunction()}
          onClick={() => this.props.DownFunction()}
          onHoldEnd={() => {
            // Callback fired once after the last hold action.
          }}
          onRelease={(event) => {
            // Callback fired when the mouseup, touchcancel, or touchend event is triggered.
          }}
        >
          <Button //DOWN:
            outline
            color="danger"
            style={{
              zIndex: 1000,
              borderRadiusTopLeft: 0,
              borderRadiusTopRight: 0,
              position: "absolute",
              bottom: tilesize,
              left: tilesize * 2,
              width: tilesize,
              height: tilesize,
            }}
          >
            v
          </Button>
        </Repeatable>
        <Repeatable
          repeatDelay={interval}
          repeatInterval={interval}
          onHoldStart={() => this.props.LeftFunction()}
          onHold={() => this.props.LeftFunction()}
          onClick={() => this.props.LeftFunction()}
          onHoldEnd={() => {
            // Callback fired once after the last hold action.
          }}
          onRelease={(event) => {
            // Callback fired when the mouseup, touchcancel, or touchend event is triggered.
          }}
        >
          <Button //LEFT:
            outline
            color="danger"
            style={{
              zIndex: 1000,
              borderRadiusTopRight: 0,
              borderRadiusBottomRight: 0,
              position: "absolute",
              bottom: tilesize * 2,
              left: tilesize,
              width: tilesize,
              height: tilesize,
            }}
          >
            {"<"}
          </Button>
        </Repeatable>

        <Button //A Button
          outline
          color="danger"
          style={{
            zIndex: 1000,
            borderRadius: 15,
            position: "absolute",
            bottom: tilesize * 2,
            right: tilesize * 3,
            width: tilesize * 1.5,
            height: tilesize * 1.5,
          }}
          onClick={() => this.props.AFunction()}
        >
          A
        </Button>
        <Button //B Button
          outline
          color="danger"
          style={{
            zIndex: 1000,
            borderRadius: 15,
            position: "absolute",
            bottom: tilesize * 1.5,
            right: tilesize * 1,
            width: tilesize * 1.5,
            height: tilesize * 1.5,
          }}
          onClick={() => this.props.BFunction()}
        >
          B
        </Button>
        {/*<Button //Start Button
          outline
          color="primary"
          style={{
            zIndex: 1000,
            position: "absolute",
            bottom: tilesize * 0.5,
            left: tilesize * 8,
            width: tilesize * 0.9,
            height: tilesize * 0.25,
          }}
          onClick={() => this.props.StartFunction()}
        >
          start
        </Button>
        <Button //Select Button
          outline
          color="danger"
          style={{
            zIndex: 1000,
            position: "absolute",
            bottom: tilesize * 0.5,
            right: tilesize * 8,
            width: tilesize * 0.9,
            height: tilesize * 0.25,
          }}
          onClick={() => this.props.SelectFunction()}
        >
          sel
        </Button>*/}
      </div>
    );
  }
}
export default ControlButtons;
