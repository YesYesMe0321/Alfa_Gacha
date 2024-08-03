document.addEventListener("DOMContentLoaded", function () {
    const problemTypeSelect = document.getElementById("problem-type");
    const problemDescription = document.getElementById("problem-description");
    const probabilityTable = document.getElementById("probability-table");
    const answerInput = document.getElementById("answer-input");
    const checkAnswerButton = document.getElementById("check-answer-button");
    const result = document.getElementById("result");
    const retryButton = document.getElementById("retry-button");
    const newProblemButton = document.getElementById("new-problem-button");

    let currentAnswer;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateProbabilities(starCount) {
        const probabilities = [];
        let remainingPercentage = 100;

        for (let i = 0; i < starCount - 1; i++) {
            const probability = parseFloat((Math.random() * (remainingPercentage / (starCount - i))).toFixed(2));
            remainingPercentage -= probability;
            probabilities.push(probability);
        }

        probabilities.push(parseFloat(remainingPercentage.toFixed(2)));

        return probabilities.sort((a, b) => b - a);
    }

    function generateMarkdownTable(starCount, probabilities) {
        let table = "|★의 개수|확률|\n|---|---|\n";
        for (let i = 0; i < starCount; i++) {
            table += `|${'★'.repeat(i + 1)}|${probabilities[i]}%|\n`;
        }
        return table;
    }

    function generateProblem() {
        const problemType = problemTypeSelect.value;
        const starCount = getRandomInt(3, 5);
        const probabilities = generateProbabilities(starCount);
        const markdownTable = generateMarkdownTable(starCount, probabilities);

        let m, n, p, problemText;

        switch (problemType) {
            case "type1":
                m = getRandomInt(10, 100);
                n = getRandomInt(1, starCount);
                p = probabilities[n - 1];
                currentAnswer = 1 - Math.pow((1 - p / 100), m);
                problemText = `가챠를 ${m}회 돌렸을 때 최소 1개의 ★${n}이 나올 확률을 구하는 식을 작성하세요.`;
                break;
            case "type2":
                m = getRandomInt(10, 100);
                n = getRandomInt(1, starCount);
                p = probabilities[n - 1];
                currentAnswer = Math.pow((1 - p / 100), m);
                problemText = `가챠를 ${m}회 돌렸을 때 ★${n}이 한 번도 나오지 않을 확률을 구하는 식을 작성하세요.`;
                break;
            case "type3":
                m = getRandomInt(10, 100);
                n = getRandomInt(1, starCount);
                p = probabilities[n - 1];
                currentAnswer = m * (p / 100);
                problemText = `가챠를 ${m}회 돌렸을 때 ★${n}이 나올 평균적인 횟수를 구하는 식을 작성하세요.`;
                break;
        }

        probabilityTable.innerHTML = marked.parse(markdownTable);
        problemDescription.textContent = problemText;

        // 현재 문제 유형을 로컬 스토리지에 저장
        localStorage.setItem('lastProblemType', problemType);
    }

    function checkAnswer() {
        const userAnswerInput = answerInput.value.trim();
        const arithmeticOperators = ['+', '-', '*', '/', '^', '%'];
        let containsArithmeticOperator = false;

        for (const operator of arithmeticOperators) {
            if (userAnswerInput.includes(operator)) {
                containsArithmeticOperator = true;
                break;
            }
        }

        if (!containsArithmeticOperator) {
            result.textContent = "유효하지 않은 답변입니다.\n답변은 수식으로만 받으며, 입력하신 답변에는 정답을 내기 위한 기본적인 산술 연산자가 포함되어있지 않습니다.";
            result.style.color = "red";
            return;
        }

        let userAnswer;
        try {
            userAnswer = math.evaluate(userAnswerInput);
        } catch (error) {
            result.textContent = "유효하지 않은 입력입니다.";
            result.style.color = "red";
            return;
        }

        if (Math.abs(userAnswer - currentAnswer) < 0.0001) {
            result.textContent = "정답입니다!";
            result.style.color = "green";
        } else {
            result.textContent = "오답입니다.";
            result.style.color = "red";
        }

        answerInput.disabled = true;
        checkAnswerButton.disabled = true;

        retryButton.style.display = "inline";
        newProblemButton.style.display = "inline";
    }

    function reset() {
        answerInput.value = "";
        result.textContent = "";
        answerInput.disabled = false;
        checkAnswerButton.disabled = false;
        retryButton.style.display = "none";
        newProblemButton.style.display = "none";
    }

    // 로컬 스토리지에서 마지막 문제 유형을 불러와서 설정
    const lastProblemType = localStorage.getItem('lastProblemType');
    if (lastProblemType) {
        problemTypeSelect.value = lastProblemType;
    }

    problemTypeSelect.addEventListener("change", generateProblem);
    checkAnswerButton.addEventListener("click", checkAnswer);
    retryButton.addEventListener("click", reset);
    newProblemButton.addEventListener("click", function () {
        reset();
        generateProblem();
    });

    generateProblem();
});
