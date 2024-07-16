document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("gachaForm");
    const probabilityInput = document.getElementById("probability");
    const costInput = document.getElementById("cost");
    const pieceProbabilityInput = document.getElementById("pieceProbability");
    const pieceCountMinInput = document.getElementById("pieceCountMin");
    const pieceCountMaxInput = document.getElementById("pieceCountMax");
    const requiredPiecesInput = document.getElementById("requiredPieces");
    const pieceCountGroup = document.getElementById("pieceCountGroup");
    const requiredPiecesGroup = document.getElementById("requiredPiecesGroup");
    const calculateButton = document.getElementById("calculateButton");
    const buttonOverlay = document.getElementById("buttonOverlay");
    const ceilingInput = document.getElementById("ceiling");
    const increasePointInput = document.getElementById("increasePoint");
    const increaseProbabilityInput = document.getElementById("increaseProbability");
    const results = document.getElementById("results");
    const averageTriesEl = document.getElementById("averageTries");
    const averageCostEl = document.getElementById("averageCost");
    const probabilityGettingAtLeastOneEl = document.getElementById("probabilityGettingAtLeastOne");

    function checkButtonState() {
        const probabilityValid = probabilityInput.value;
        const costValid = costInput.value;
        const ceilingValid = ceilingInput.value;
        const pieceProbabilityValid = pieceProbabilityInput.value;
        const pieceCountMinValid = pieceCountMinInput.value;
        const pieceCountMaxValid = pieceCountMaxInput.value;
        const requiredPiecesValid = requiredPiecesInput.value;
        const increasePointValid = increasePointInput.value;
        const increaseProbabilityValid = increaseProbabilityInput.value;
        const pieceCountValid = parseInt(pieceCountMinInput.value) <= parseInt(pieceCountMaxInput.value);

        const isPieceSystemComplete = !pieceProbabilityValid || (pieceProbabilityValid && pieceCountMinValid && pieceCountMaxValid && requiredPiecesValid && pieceCountValid);
        const isIncreaseSystemComplete = !increasePointValid || (increasePointValid && increaseProbabilityValid);
        const isIncreaseSystemIncomplete = increasePointValid || increaseProbabilityValid;

        if (probabilityValid && costValid && ceilingValid && isPieceSystemComplete && isIncreaseSystemComplete && !(isIncreaseSystemIncomplete && (!increasePointValid || !increaseProbabilityValid))) {
            calculateButton.disabled = false;
            buttonOverlay.style.display = "none";
        } else {
            calculateButton.disabled = true;
            buttonOverlay.style.display = "block";
        }
    }

    probabilityInput.addEventListener("input", checkButtonState);
    costInput.addEventListener("input", checkButtonState);
    ceilingInput.addEventListener("input", checkButtonState);
    pieceProbabilityInput.addEventListener("input", function () {
        if (pieceProbabilityInput.value) {
            pieceCountGroup.style.display = "block";
            requiredPiecesGroup.style.display = "block";
        } else {
            pieceCountGroup.style.display = "none";
            requiredPiecesGroup.style.display = "none";
        }
        checkButtonState();
    });

    pieceCountMinInput.addEventListener("input", checkButtonState);
    pieceCountMaxInput.addEventListener("input", checkButtonState);
    requiredPiecesInput.addEventListener("input", checkButtonState);
    increasePointInput.addEventListener("input", checkButtonState);
    increaseProbabilityInput.addEventListener("input", checkButtonState);

    buttonOverlay.addEventListener("click", function () {
        if (!probabilityInput.value) {
            alert("상품이 뜰 확률을 입력하세요.");
        } else if (!costInput.value) {
            alert("가챠 가격을 입력하세요.");
        } else if (!ceilingInput.value) {
            alert("천장 횟수를 입력하세요.");
        } else if (pieceProbabilityInput.value && (
            !pieceCountMinInput.value ||
            !pieceCountMaxInput.value ||
            !requiredPiecesInput.value)) {
            alert("조각 시스템의 모든 입력 필드를 채워주세요.");
        } else if (parseInt(pieceCountMinInput.value) > parseInt(pieceCountMaxInput.value)) {
            alert("조각의 최소 개수는 최대 개수보다 클 수 없습니다.");
        } else if (increasePointInput.value || increaseProbabilityInput.value) {
            if (!increasePointInput.value || !increaseProbabilityInput.value) {
                alert("확률 증가 시스템의 모든 입력 필드를 채워주세요.");
            }
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const probability = parseFloat(probabilityInput.value);
        const cost = parseFloat(costInput.value);
        const ceiling = parseInt(ceilingInput.value) || null;
        const increasePoint = parseInt(increasePointInput.value) || null;
        const increaseProbability = parseFloat(increaseProbabilityInput.value) || null;
        const pieceProbability = parseFloat(pieceProbabilityInput.value) || null;
        const pieceCountMin = parseInt(pieceCountMinInput.value) || null;
        const pieceCountMax = parseInt(pieceCountMaxInput.value) || null;
        const requiredPieces = parseInt(requiredPiecesInput.value) || null;

        const results = calculateGacha(probability, cost, ceiling, increasePoint, increaseProbability, pieceProbability, pieceCountMin, pieceCountMax, requiredPieces);
        averageTriesEl.textContent = `필요한 평균 가챠 횟수: ${results.averageTries}`;
        averageCostEl.textContent = `평균 비용: ${results.averageCost}`;
        probabilityGettingAtLeastOneEl.textContent = `천장 전까지 적어도 한 번 상품이 나올 확률: ${results.probabilityGettingAtLeastOne}%`;
    });

    function calculateGacha(probability, cost, ceiling, increasePoint, increaseProbability, pieceProbability, pieceCountMin, pieceCountMax, requiredPieces) {
        let initialProbability = probability / 100.0;

        if (pieceProbability !== null && pieceCountMin !== null && pieceCountMax !== null && requiredPieces !== null) {
            const averagePieceCount = (pieceCountMin + pieceCountMax) / 2;
            const pieceContribution = (pieceProbability / 100.0) * averagePieceCount / requiredPieces;
            initialProbability += pieceContribution;
        }

        let totalProbability = initialProbability;
        let averageTries;

        if (increasePoint !== null && increaseProbability !== null) {
            const increasedProbability = increaseProbability / 100.0;
            const initialTries = increasePoint;
            const increasedTries = ceiling - increasePoint;

            // 확률 증가 시점 이전의 평균 가챠 횟수
            const initialAverageTries = initialTries / initialProbability;

            // 확률 증가 시점 이후의 평균 가챠 횟수
            const increasedAverageTries = increasedTries / increasedProbability;

            // 전체 평균 가챠 횟수
            totalProbability = (initialTries * initialProbability + increasedTries * increasedProbability) / ceiling;

            // 전체 평균 가챠 횟수 계산
            averageTries = (initialAverageTries + increasedAverageTries) / ceiling;
        } else {
            averageTries = 1 / totalProbability;
        }

        // 천장이 있는 경우, 천장 횟수와 평균 가챠 횟수 중 작은 값을 사용
        const effectiveTries = ceiling !== null ? Math.min(averageTries, ceiling) : averageTries;

        // 천장 전까지 상품을 얻을 확률 계산
        const attempts = ceiling || 0;
        const probabilityNotGetting = Math.pow(1 - totalProbability, attempts);
        const probabilityGettingAtLeastOne = (1 - probabilityNotGetting) * 100;

        const averageCost = effectiveTries * cost;

        return {
            averageTries: effectiveTries.toFixed(2),
            averageCost: averageCost.toFixed(2),
            probabilityGettingAtLeastOne: probabilityGettingAtLeastOne.toFixed(2)
        };
    }
});
