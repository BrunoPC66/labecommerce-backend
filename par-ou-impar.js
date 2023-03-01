function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

const side = process.argv[2]
const number = process.argv[3]
const npc = getRndInteger(0, 10)
const resultado = +number+npc


if ((!side.includes("impar") && !side.includes("par")) || number > 10) {
    console.log("Escolha par ou impar e insira um valor de 0 a 10");
} else if (side.toLowerCase() === "par") {
    if (resultado%2 === 0) {
        console.log(`Você escolheu ${side} e o número ${number}, o computador escolheu impar e o número ${npc}, o resultado foi ${resultado}. Você ganhou!`);
    } else {
        console.log(`Você escolheu ${side} e o número ${number}, o computador escolheu impar e o número ${npc}, o resultado foi ${resultado}. Você perdeu! Tente novamente.`);
    }
} else if (side.toLowerCase() === "impar") {
    if (resultado%2 !== 0) {
        console.log(`Você escolheu ${side} e o número ${number}, o computador escolheu par e o número ${npc}, o resultado foi ${resultado}. Você ganhou!`);
    } else {
        console.log(`Você escolheu ${side} e o número ${number}, o computador escolheu par e o número ${npc}, o resultado foi ${resultado}. Você perdeu! Tente novamente.`);
    }
}