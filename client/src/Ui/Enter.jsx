import React from 'react';
import styled from 'styled-components';

const Enter = () => {
  return (
    <StyledWrapper>
      <div className="container">
        <div className="top">
          <div className="square">
            <div className="square">
              <div className="square">
                <div className="square">
                  <div className="square"><div className="square">
                    </div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="square">
            <div className="square">
              <div className="square">
                <div className="square">
                  <div className="square"><div className="square">
                    </div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="left">
          <div className="square">
            <div className="square">
              <div className="square">
                <div className="square">
                  <div className="square"><div className="square">
                    </div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="square">
            <div className="square">
              <div className="square">
                <div className="square">
                  <div className="square"><div className="square">
                    </div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    position: absolute;
    top: 45%;
    left: 48%;
  }

  .square {
    width: 8px;
    height: 30px;
    background: rgb(71, 195, 248);
    border-radius: 10px;
    display: block;
    /*margin:10px;*/
    -webkit-animation: turn 2.5s ease infinite;
    animation: turn 2.5s ease infinite;
    box-shadow: rgb(71, 195, 248) 0px 1px 15px 0px;
  }

  .top {
    position: absolute;
    left: 40%;
    top: 50%;
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }

  .bottom {
    position: absolute;
    left: 40%;
    top: 50%;
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
  }

  .left {
    position: absolute;
    left: 40%;
    top: 50%;
  }

  .right {
    position: absolute;
    left: 40%;
    top: 50%;
    -webkit-transform: rotate(-180deg);
    transform: rotate(-180deg);
  }

  @-webkit-keyframes turn {
    0% {
      transform: translateX(0) translateY(0) rotate(0);
    }

    50% {
      transform: translateX(400%) translateY(100%) rotate(90deg);
    }

    100% {
      transform: translateX(0) translateY(0) rotate(0);
    }
  }

  @keyframes turn {
    0% {
      transform: translateX(0) translateY(0) rotate(0);
    }

    70% {
      transform: translateX(400%) translateY(100%) rotate(90deg);
    }

    100% {
      transform: translateX(0) translateY(0) rotate(0);
    }
  }`;

export default Enter;
