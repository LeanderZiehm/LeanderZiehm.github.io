function main() {
    const contentDiv = document.getElementById('content');
    Object.entries(exam.chapters).forEach(([chapterId, chapter]) => {
        const chapterDiv = document.createElement('div');
        chapterDiv.classList.add('chapterContainer');
        const chapterTitle = document.createElement('h2');
        chapterTitle.textContent = chapter.title;
        chapterTitle.classList.add('chapterName');
        chapterDiv.appendChild(chapterTitle);

        exam.questions.forEach(question => {
            // Check if the question belongs to the current chapter
            if (question.id.startsWith(chapterId)) {
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
                    window.location.href = `question.html?question=${question.id}`;
                });
            }
        });
        contentDiv.appendChild(chapterDiv);
    });
}
document.addEventListener('DOMContentLoaded', main);