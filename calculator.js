document.addEventListener("DOMContentLoaded", function () {
    const calculateButton = document.getElementById("calculate-button");
    const starProbabilityInput = document.getElementById("star-probability");
    const attemptsInput = document.getElementById("attempts");
    const calculationResult = document.getElementById("calculation-result");
    const averageResult = document.getElementById("average-result");

    calculateButton.addEventListener("click", function () {
        const starProbability = parseFloat(starProbabilityInput.value) / 100;
        const attempts = parseInt(attemptsInput.value);

        if (isNaN(starProbability) || isNaN(attempts) || starProbability <= 0 || starProbability >= 1) {
            calculationResult.textContent = "유효하지 않은 입력입니다.";
            calculationResult.style.color = "red";
            return;
        }

        const probNoStar = Math.pow(1 - starProbability, attempts);
        const probAtLeastOneStar = 1 - probNoStar;

        calculationResult.textContent = `최소 1개의 ★이 나올 확률은 ${(probAtLeastOneStar * 100).toFixed(2)}%입니다.`;
        calculationResult.style.color = "black";

        const averageAttempts = 1 / starProbability;
        averageResult.textContent = `평균적으로 ${averageAttempts.toFixed(2)}회 시도 시 ★을 뽑을 수 있습니다.`;
        averageResult.style.color = "black";
    });
});
