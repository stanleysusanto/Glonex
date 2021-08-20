<script>
  //   import * as axios from "https://cdn.skypack.dev/axios@0.21.1";
  import axios from "axios";

  let form;
  let inputElement;
  let elem;

  document.querySelectorAll(".donate").forEach(function (elem) {
    const inputElement = elem.querySelector("input");
    const form = elem.querySelector("form");

    const input = SimpleMaskMoney.setMask(inputElement, {
      prefix: "$",
      fixed: true,
      fractionDigits: 2,
      decimalSeparator: ".",
      thousandsSeparator: ",",
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      //const axios = require('axios')

      //         axios({
      // method: 'post',
      // url: 'https://demo.checkbook.io/v3/check/digital',
      // data: `"recipient":"testing@checkbook.io", "name":"Widgets Inc.", "amount":8, "description":"Test Check"`,
      // headers: { "Accept": "application/json", "Authorization": "d6aa2703655f4ba2af2a56202961ca86:dXbCgzYBMibj8ZwuQMd2NXr6rtvjZ8", "Content-Type": "application/json; charset=utf-8"}
      // }).then(response => {
      //             console.log("response");
      //         }).catch(error => {
      //             console.log("error");
      //         })

      axios
        .post(
          "https://demo.checkbook.io/v3/check/digital",
          {
            recipient: "testing@checkbook.io",
            name: "Widgets Inc.",
            amount: input.formatToNumber(),
            description: "Test Check",
          },
          {
            headers: {
              Accept: "application/json",
              Authorization:
                "d6aa2703655f4ba2af2a56202961ca86:dXbCgzYBMibj8ZwuQMd2NXr6rtvjZ8",
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

      elem.classList.add("submit");
    });

    //     document.addEventListener("click", (e) => {
    //       if (e.target === form || form.contains(e.target)) {
    //         return;
    //       }
    //       if (e.target === elem || elem.contains(e.target)) {
    //         if (!elem.classList.contains("submit")) {
    //           if (elem.classList.contains("open")) {
    //             elem.classList.add("submit");
    //           } else {
    //             elem.classList.add("open");
    //             setTimeout(() => {
    //               inputElement.selectionStart = inputElement.selectionEnd = 10000;
    //               inputElement.focus();
    //             }, 0);
    //           }
    //         }
    //         return;
    //       }
    //       if (!elem.classList.contains("submit")) {
    //         elem.classList.remove("open");
    //       }
    //     });
  });
</script>

<div class="donate" bind:this={elem}>
  <div class="thanks">Thank you!</div>
  <button
    on:click={(e) => {
      console.log("hello");
      if (e.target === form || form.contains(e.target)) {
        return;
      }
      if (e.target === elem || elem.contains(e.target)) {
        if (!elem.classList.contains("submit")) {
          if (elem.classList.contains("open")) {
            elem.classList.add("submit");
          } else {
            elem.classList.add("open");
            setTimeout(() => {
              inputElement.selectionStart = inputElement.selectionEnd = 10000;
              inputElement.focus();
            }, 0);
          }
        }
        return;
      }
      if (!elem.classList.contains("submit")) {
        elem.classList.remove("open");
      }
    }}
  >
    <div class="top" />
    <div class="inside">
      <form bind:this={form}>
        <input bind:this={inputElement} type="text" value="$0,00" />
      </form>
    </div>
    <span>
      <svg viewBox="0 0 24 24">
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        />
      </svg>
      Donate
    </span>
  </button>
</div>

<style>
  .donate {
    --input-background: #000;
    --input-color: #fff;
    --input-line: #fff;
    --button-background: #fff;
    --button-background-hover: #eceffc;
    --button-color: #000;
    --button-icon-color: #000;
    --thanks-color: #fff;
    --letter-inner: #cedaff;
    --letter-inner-top: #e0e8ff;
    --letter-border: #e5e9f3;
    font-family: "Roboto Mono", monospace;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    position: relative;
    text-align: center;
    width: 132px;
  }
  .donate:not(.open):hover {
    --background: var(--button-background-hover);
  }
  .donate:not(.open) form {
    pointer-events: none;
  }
  .donate.open {
    --span-opacity: 0;
    --span-opacity-delay: 0s;
    --letter-opacity: 1;
    --letter-opacity-delay: 0.2s;
    --letter-inside-opacity: 1;
    --letter-inside-opacity-delay: 0.4s;
    --border-radius: 2px;
    --border-radius-delay: 0s;
  }
  .donate.open:not(.submit) {
    --input-y: -92px;
    --input-y-delay: 0.9s;
    --letter-top-y: 1px;
    --letter-top-rotate: 180deg;
    --letter-top-rotate-delay: 0.5s;
    --letter-top-index: 0;
    --letter-top-index-delay: 0.9s;
    --letter-background: var(--letter-inner-top);
    --letter-background-delay: 0.65s;
    --input-scale-background: 1;
    --input-scale-background-delay: 1.1s;
    --input-scale-line: 1;
    --input-scale-line-delay: 1.1s;
  }
  .donate.open.submit button {
    animation: move 0.4s linear 1.1s forwards;
  }
  .donate .thanks {
    position: absolute;
    left: 0;
    right: 0;
    top: 12px;
    color: var(--thanks-color);
    font-size: 16px;
    font-weight: 500;
  }
  .donate button {
    display: block;
    cursor: pointer;
    font: inherit;
    position: relative;
    outline: none;
    border: none;
    width: 100%;
    margin: 0;
    padding: 12px 0;
    -webkit-appearance: none;
    transform-style: preserve-3d;
    border-radius: var(--border-radius, 6px);
    color: var(--button-color);
    background: var(--background, var(--button-background));
    transform-origin: 0 50%;
    transition: background 0.2s linear,
      border-radius 0.2s linear var(--border-radius-delay, 1.15s);
  }
  .donate button:before {
    content: "";
    border-width: 0 64px 32px 64px;
    width: 0;
    height: 0;
    position: absolute;
    left: 2px;
    bottom: 0;
    border-style: solid;
    border-color: transparent transparent var(--button-background) transparent;
    filter: drop-shadow(0 -1px 0 var(--letter-border));
    opacity: var(--letter-opacity, 0);
    transition: opacity 0.2s linear var(--letter-opacity-delay, 1.15s);
  }
  .donate button .inside {
    position: absolute;
    left: -40px;
    bottom: 16px;
    right: -40px;
    height: 120px;
    clip-path: polygon(0 0, 100% 0, 100% 72px, 50% 100%, 0 72px);
    opacity: var(--letter-inside-opacity, 0);
    transition: opacity 0s linear var(--letter-inside-opacity-delay, 1.15s);
  }
  .donate button .inside:before {
    content: "";
    height: 28px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--letter-inner);
  }
  .donate button .inside form {
    width: 200px;
    position: absolute;
    bottom: -12px;
    left: 50%;
    margin: 0;
    transform-style: preserve-3d;
    transform: translate(-50%, var(--input-y, 0)) translateZ(0);
    transition: transform 0.3s ease-out var(--input-y-delay, 0.25s);
  }
  .donate button .inside form:before,
  .donate button .inside form:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    backface-visibility: hidden;
    background: var(--b, var(--input-background));
    transform: scaleX(var(--scale, var(--input-scale-background, 0.6)))
      translateZ(0);
    transition: opacity 0.25s linear,
      transform 0.25s linear
        var(--delay, var(--input-scale-background-delay, 0s));
  }
  .donate button .inside form:before {
    top: 0;
  }
  .donate button .inside form:after {
    --b: var(--input-line);
    --scale: var(--input-scale-line, 0);
    --delay: var(--input-scale-line-delay, 0s);
    height: 1px;
    opacity: var(--line-opacity, 0.5);
  }
  .donate button .inside form input {
    display: block;
    position: relative;
    z-index: 1;
    font: inherit;
    text-align: center;
    outline: none;
    border: none;
    background: none;
    width: 100%;
    margin: 0;
    padding: 8px 0;
    -webkit-appearance: none;
    color: var(--input-color);
  }
  .donate button .inside form:focus-within {
    --line-opacity: 1;
  }
  .donate button .top {
    position: absolute;
    z-index: var(--letter-top-index, 2);
    top: 0;
    left: 2px;
    transform-origin: 50% 0;
    transform: translateY(var(--letter-top-y, 0))
      rotateX(var(--letter-top-rotate, 0deg)) translateZ(0);
    opacity: var(--letter-opacity, 0);
    border-style: solid;
    border-width: 28px 64px 0 64px;
    border-color: var(--letter-background, var(--button-background)) transparent
      transparent transparent;
    transition: z-index 0s linear var(--letter-top-index-delay, 0.6s),
      border-color 0.1s linear var(--letter-background-delay, 0.75s),
      opacity 0.2s linear var(--letter-opacity-delay, 1.15s),
      transform 0.3s linear var(--letter-top-rotate-delay, 0.6s);
    filter: drop-shadow(0 var(--letter-blur, 1px) 0 var(--letter-border));
  }
  .donate button span {
    display: block;
    opacity: var(--span-opacity, 1);
    transition: opacity 0.15s linear var(--span-opacity-delay, 1.25s);
  }
  .donate button span svg {
    display: inline-block;
    vertical-align: top;
    margin: 2px 0 0 0;
    width: 16px;
    height: 16px;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    stroke-width: 2.5;
    transform: translate(-4px, 0);
    stroke: var(--button-icon-color);
  }
  @keyframes move {
    20% {
      transform: translateX(-2px);
    }
    60% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateX(320px);
    }
  }
  html {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
  }
  * {
    box-sizing: inherit;
  }
  *:before,
  *:after {
    box-sizing: inherit;
  }
</style>
