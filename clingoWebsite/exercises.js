
const exercises = [{
    task: "Exercise 1: Write a program that represents the colors red, green, and blue as Clingo atoms.",
    tip: "Do not use pooling, just write the atoms down manually like atom(info).",
    solution: `color(red).\ncolor(green).\ncolor(blue).`
}, {
    task: "Exercise 2: Use pooling to represent the colors red, green, and blue.",
    tip: "",
    solution: "color(red;green;blue)."
}, {
    task: "Exercise 3: Add two people, Jack and Jane, and create a new atom that assigns their favorite color. Jack's favorite color is red and Jane's favorite color is blue.",
    tip: "",
    solution: `favoriteColor(jane,blue).
favoriteColor(jack,red).`
}, {
    task: "Exercise 4: Add a new two-element atom called aged that specifies that Jack is 20 years old and Jane is 21 years old. Write a rule that assigns a new atom called number using a variable called Number to extract only the age.",
    tip: "Use '-' to specify the head of the rule. The name of the other variable doesn't matter.",
    solution: `age(jack,20).
age(jane,21).
number(Number) :- age(_,Number).`
}, {
    task: "Exercise 5: Create a new atom called likesNature. Create a rule that assigns a person this atom if they like the color green.",
    tip: "",
    solution: `likesNature(Person) :- favoriteColor(Person,green).`
}, {
    task: "Exercise 6: Add another person called Ben. Ben likes every color. Create a rule that automatically assigns Ben every color in the color atom. Do not assign the colors manually!",
    tip: "",
    solution: `color(red;green;blue).
favoriteColor(ben,Color) :- color(Color).`
}, {
    task: "Exercise 7: Create an atom called sports. It should contain football and badminton. Create a choice rule that instantiates a new atom called choice. It should choose whether you want to not take any sport, one of them, or both.",
    tip: "Choice rules look like this: { newAtom(Variable) : otherAtom(Variable) }.",
    solution: `sport(football;badminton).
{ choice(S) : sport(S) }.`
}];