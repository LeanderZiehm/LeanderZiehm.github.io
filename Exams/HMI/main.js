//add
// console.log('main.js loaded');

const scriptsToAdd = [
    'exam.js',
    '../based/app.js',
    '../based/base.js',
    'firebase.js'
];


for (const script of scriptsToAdd) {
   const scriptString = `<script src="${script}"></script>`;
    document.write(scriptString);
}


function main(){

    // console.log(exam);

    const contentDiv = document.getElementById('content');

    const questions = []

    exam.forEach(chapter => {
        const chapterDiv = document.createElement('div');
        chapterDiv.classList.add('chapterContainer');
        const chapterTitle = document.createElement('h2');
        chapterTitle.textContent = chapter.chapter;
        chapterTitle.classList.add('chapterName');
        chapterDiv.appendChild(chapterTitle);
        chapter.questions.forEach(question => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('questionContainer');
            const questionText = document.createElement('div');
            questionText.classList.add('question');
            questionText.textContent = question.question;
            questionDiv.appendChild(questionText);
            const pointsElement = document.createElement('div');
            pointsElement.classList.add('points');
            pointsElement.textContent = `(${question.points} points)`;
            questionDiv.appendChild(pointsElement);
            chapterDiv.appendChild(questionDiv);

            //redirect to url on click
            questionDiv.addEventListener('click', () => {
                window.location.href = `question.html?question=${420}`;
            });
        });

        contentDiv.appendChild(chapterDiv);
    });
}






document.addEventListener('DOMContentLoaded', main);