<script>
  import axios from "axios";

  let moneyAmount;

  function donate() {
    axios
      .post(
        "https://demo.checkbook.io/v3/check/digital",
        {
          recipient: "kimeiga@outlook.com",
          name: "Hakan Kimeiga",
          amount: moneyAmount,
          description: "Thank you for Glonex",
        },
        {
          crossDomain: true,
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
        console.error(error);
      });

    moneyAmount = null;
  }
</script>

<button on:click={donate}>Donate</button>
<input type="number" bind:value={moneyAmount} placeholder="Amount" />
