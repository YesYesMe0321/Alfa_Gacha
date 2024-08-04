document.addEventListener("DOMContentLoaded", function () {
    const calculateButton = document.getElementById("calculate-button");
    const starProbabilityInput = document.getElementById("star-probability");
    const attemptsInput = document.getElementById("attempts");
    const calculationResult = document.getElementById("calculation-result");
    const formula = document.getElementById("formula");
    const averageResult = document.getElementById("average-result");
    const warning = document.getElementById("warning");
    const averageFormula = document.getElementById("average-formula");

    calculateButton.addEventListener("click", function () {
        const starProbability = parseFloat(starProbabilityInput.value) / 100;
        const attempts = parseInt(attemptsInput.value);

        if (isNaN(starProbability) || isNaN(attempts) || starProbability <= 0 || starProbability >= 1) {
            calculationResult.textContent = "유효하지 않은 입력입니다.";
            calculationResult.style.color = "red";
            formula.textContent = "";
            averageResult.textContent = "";
            warning.textContent = "";
            averageFormula.textContent = "";
            return;
        }

        const probNoStar = Math.pow(1 - starProbability, attempts);
        const probAtLeastOneStar = 1 - probNoStar;

        calculationResult.textContent = `최소 1개의 ★이 나올 확률은 ${(probAtLeastOneStar * 100).toFixed(2)}%입니다.`;
        calculationResult.style.color = "black";
        formula.textContent = `사용된 식:\n1 - (1 - ${starProbability})^${attempts}`;

        const averageAttempts = 1 / starProbability;
        averageResult.textContent = `평균적으로 ${averageAttempts.toFixed(2)}회 시도 시 ★을 뽑을 수 있습니다.`;
        averageResult.style.color = "black";
        averageFormula.textContent = `사용된 식:\n1 / ${starProbability}`;

        if (averageAttempts > attempts) {
            warning.textContent = '예고한 시도 횟수로는 부족할 수도 있습니다!';
        } else {
            warning.textContent = '';
        }
    });
});
