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
            formula.style.display = "none";
            averageResult.textContent = "";
            warning.textContent = "";
            averageFormula.textContent = "";
            averageFormula.style.display = "none";
            return;
        }

        const probNoStar = Math.pow(1 - starProbability, attempts);
        const probAtLeastOneStar = 1 - probNoStar;

        calculationResult.textContent = `상품을 최소 1개 얻을 확률은 ${(probAtLeastOneStar * 100).toFixed(2)}%입니다.`;
        calculationResult.style.color = "black";
        formula.textContent = `사용된 식:\n상품을 무조건 얻을 확률 - 상품을 얻지 못할 확률\n= 1 - (1 - 상품이 나올 확률)^시도 횟수\n= 1 - (1 - ${starProbability})^${attempts}\n= ${probAtLeastOneStar.toFixed(6)}...\n\n퍼센트로 표시하기 위해 반올림 해준 후 100을 곱해 ${(probAtLeastOneStar * 100).toFixed(2)}% 를 도출.`;
        formula.style.display = "block";

        const averageAttempts = 1 / starProbability;
        averageResult.textContent = `평균적으로 ${averageAttempts.toFixed(2)}회 시도 시 상품을 뽑을 수 있습니다.`;
        averageResult.style.color = "black";
        averageFormula.textContent = `사용된 식:\n기대값 = 1 / 상품이 나올 확률\n= 1 / ${starProbability} ≈ ${averageAttempts.toFixed(6)}...\n\n반올림하여 평균적으로 ${averageAttempts.toFixed(2)}회 시도 시 상품을 뽑을 수 있습니다.`;
        averageFormula.style.display = "block";

        if (averageAttempts > attempts) {
            warning.textContent = '예고한 시도 횟수로는 부족할 수도 있습니다!';
        } else {
            warning.textContent = '';
        }
    });
});
