import React from 'react';
import styled from 'styled-components';

const AnimatedButton = styled.div `
.btn {
  font-size: 1em;
  line-height: 1em;
  letter-spacing: 0.04em;
  display: inline-block;
  margin-left: 6px;
  color: white;

  &--svg {
      position: relative;
      height: 42px;
      width: 190px;
      overflow: hidden;
      border-radius: 5px;
      


      &:hover {
          .btn--svg__circle {
              circle {
                  -webkit-transform: scale(0);
                  -moz-transform: scale(0);
                  -ms-transform: scale(0);
                  transform: scale(0);
              }
          }

          .btn--svg__label {

              color:  #FFF;
          }

          .btn--svg__border--left,
          .btn--svg__border--right {
              path {
                  stroke-dasharray: 61.8204345703125 61.8204345703125;
                  stroke-dashoffset: 0;
                  -webkit-transition-delay: 0.25s;
                  -webkit-transition-duration: 0.5s;
                  -webkit-transition-timing-function: ease-in-out;
                  -webkit-transition-property: stroke-dashoffset;
                  -moz-transition-delay: 0.25s;
                  -moz-transition-duration: 0.5s;
                  -moz-transition-timing-function: ease-in-out;
                  -moz-transition-property: stroke-dashoffset;
                  -ms-transition-delay: 0.25s;
                  -ms-transition-duration: 0.5s;
                  -ms-transition-timing-function: ease-in-out;
                  -ms-transition-property: stroke-dashoffset;
                  transition-delay: 0.25s;
                  transition-duration: 0.5s;
                  transition-timing-function: ease-in-out;
                  transition-property: stroke-dashoffset;
              }
          }
      }

      &__label {
          -webkit-font-smoothing: antialiased;
          font-family: sans-serif;
          font-weight: bold;
          text-align:center;
          color: white;
          z-index: 3;
          width: 100%;
          -webkit-transition: color 0.5s ease-in-out;
          -moz-transition: color 0.5s ease-in-out;
          -ms-transition: color 0.5s ease-in-out;
          transition: color 0.5s ease-in-out;
      }

      &__circle {
          circle {
              -webkit-transition: transform 0.5s ease-in-out;
              -webkit-transform: scale(1.1);
              -webkit-transform-origin: 50% 50%;
              -moz-transition: transform 0.5s ease-in-out;
              -moz-transform: scale(1.1);
              -moz-transform-origin: 50% 50%;
              -ms-transition: transform 0.5s ease-in-out;
              -ms-transform: scale(1.1);
              -ms-transform-origin: 50% 50%;
              transition: transform 0.5s ease-in-out;
              transform: scale(1.1);
              transform-origin: 50% 50%;
          }
      }

      &__border {

          &--left,
          &--right {
              path {
                  stroke-dasharray: 61.8204345703125 61.8204345703125;
                  -webkit-transition-duration: 0s;
                  -webkit-transition-timing-function: ease-in-out;
                  -webkit-transition-property: stroke-dashoffset;
                  -webkit-transition-delay: 0.5s;
                  -moz-transition-duration: 0s;
                  -moz-transition-timing-function: ease-in-out;
                  -moz-transition-property: stroke-dashoffset;
                  -moz-transition-delay: 0.5s;
                  -ms-transition-duration: 0s;
                  -ms-transition-timing-function: ease-in-out;
                  -ms-transition-property: stroke-dashoffset;
                  -ms-transition-delay: 0.5s;
                  transition-duration: 0s;
                  transition-timing-function: ease-in-out;
                  transition-property: stroke-dashoffset;
                  transition-delay: 0.5s;
              }
          }

          &--left {
              path {
                  stroke-dashoffset: -61.8204345703125;
              }
          }

          &--right {
              path {
                  stroke-dashoffset: 61.8204345703125;
              }
          }
      }

      svg,
      &__label {
          position: absolute;
          top: 50%;
          left: 50%;
          -webkit-transform: translate(-50%, -50%);
          -webkit-transform-origin: 50% 50%;
          -moz-transform: translate(-50%, -50%);
          -moz-transform-origin: 50% 50%;
          -ms-transform: translate(-50%, -50%);
          -ms-transform-origin: 50% 50%;
          transform: translate(-50%, -50%);
          transform-origin: 50% 50%;
      }
  }
}

// Utils
.c-white {
  color:  #FFF
}

.trailer {
  margin-bottom: 40px;
  
  &--nano {
      margin-bottom: 10px;
  }
}

a {
  position: relative;
  text-decoration: none;
  color: red;
  
  &:after {
      content: '';
      height: 1px;
      bottom: -4px;
      position: absolute;
      left: 5%;
      right: 95%;
      background: red;
      transition: right 0.25s ease-in-out;
  }
  
  &:hover:after {
      right: 5%;
  }
}

.teasing-1,
.heading-2 {
  font-family: sans-serif;
  letter-spacing: 0.04em;
  -webkit-font-smoothing: antialiased;
}

.teasing-1 {
  font-size: 14px;
  line-height: 14px;
}

.heading-2 {
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  text-transform: uppercase;
}
`;

export default AnimatedButton;
