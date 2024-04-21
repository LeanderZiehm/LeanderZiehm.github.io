
const exercises = [{
    task: 'Write a program that represents the colors red, green, and blue as separate Clingo atoms.',
    tip: 'Do not use pooling, just write the atoms down manually.',
    example: 'atom(info).',
    solution: 'color(red). color(green). color(blue).',
    output: 'color(red) color(green) color(blue)',
    description: 'introduction to atoms'
},{
    task: 'Use pooling to represent the colors red, green, and blue.',
    tip: 'Pooling is compressing the atoms into one line using semicolons as separators.',
    example: 'atom(info;info2;info3).',
    solution: 'color(red;green;blue).',
    output: 'color(red) color(green) color(blue)',
    description: 'introduction to pooling'
},{
    task: 'Define a two-element atom called colorCombination with the elements red and blue. Generate an atom called createdColor which will add purple as an element if colorCombination contains red as the first element and blue as the second element.',
    tip: 'Conditional if rules can be specifyed with :- after the defined atom.',
    example: 'createdAtom(createdElement) :- otherAtom(otherElement).',
    solution: 'colorCombination(red, blue). createdColor(purple) :- colorCombination(red, blue).',
    output: 'colorCombination(red,blue) createdColor(purple)',
    description: 'introduction to rules that use constants',
    TODO: "what about (red, blue) or (blue,red). where order doesn't matter?"
},{
    task: 'Define an atom which is called atomToTakeFrom with the values 5 and 12. Use pooling for the atom definition. Now generate a new atom called copy, that automatically copies all the elements from atomToTakeFrom.',
    tip: 'You can copy elements from another atom by using Varables. Varaibles are always capitalized.',
    example: 'generatedAtom(Variable) :- otherAtom(Variable).',
    solution: 'atomTakenFrom(5;12). copy(Variable) :- atomTakenFrom(Variable).',
    output: 'atomTakenFrom(5) atomTakenFrom(12) copy(5) copy(12)',
    description: 'introduction to rules to copy an element from another atom'
},{
    task: 'Add a two-element atom called aged that specifies that Jack is 20 years old and Jane is 21 years old. Write a rule that generates a new atom called number. Use a variable named Number to copy the age from aged.',
    tip: 'If the atom that we take from has more elements than we need, then we can use _ as a name for each of the useless variables.',
    example: 'generatedAtom(Variable) :- otherAtom(_,_,Variable,_).',
    solution: 'age(jack,20). age(jane,21). number(Number) :- age(_,Number).',
    output: 'age(jack,20) age(jane,21) number(20) number(21)',
    description: 'copy rules with more elements than needed'
},{
    task: 'Define an atom called number which as the elements 1 and 20. Generate an atom called biggerThan10 that uses a rule to copy the numbers that are bigger than 10. ',
    tip: 'Rules that only copy certain elements can be achieved through adding each condition with a , after the initial rule',
    example: 'meetsConditions(Number) :- number(Number), Number < 40, Number > 5, Number == 30.',
    solution: 'number(1;20). biggerThan10(Number) :- number(Number),Number>10.',
    output: 'number(1) number(20) biggerThan10(20)',
    description: 'introduction to rules that use conditions on numbers',
},

 {
    task: 'Define a two-element atom called person that stores their name and gender. Avery is female, Logan is male and Casey is female. Generate an one-element atom called isFemale which should only contain names of Females. Use a rule for that.',
    tip: 'If we have multible groups that are defined by an element we can hardcode that element to only get variables from that type.',
    example: 'likesNature(Person) :- favoriteColor(Person,green).',
    solution: 'person(avery,female). person(logan,male). person(casey,female). isFemale(Name) :- person(Name,female).',
    output: 'person(avery,female) person(logan,male) person(casey,female) isFemale(avery) isFemale(casey)',
    description: 'rules to copy subgroups of elements',
    TODO: "(MAKE EXERCISE 7 CLEARER)"
}, 

{
    task: 'Create an atom called sports. It should contain football and badminton. Create a choice rule that instantiates a new atom called choice. It should choose whether you want to not take any sport, one of them, or both.',
    tip: '',
    example: '{ newAtom(Variable) : otherAtom(Variable) }.',
    solution: 'sport(football;badminton). { choice(S) : sport(S) }.',
    output: '[Models       : 4]\nAnswer: 1\nsport(football) sport(badminton)\nAnswer: 2\nsport(football) sport(badminton) choice(badminton)\nAnswer: 3\nsport(football) sport(badminton) choice(football)\nAnswer: 4\nsport(football) sport(badminton) choice(football) choice(badminton)',
    description: 'introduction to choice rules using single element.'
},


{
    task: 'color(red;green;blue). Define a two-element atom where the first element is ben and the second element gets assigned by a choice rule. Assign ben all combinations of colors.',
    tip: 'Choice rules uses {} around the new atom to create all combinations of elements using multiple models. You can think of them almost as paralell universes.',
    example: '{newAtom(constant,Varable)} :- atom(Varable).',
    solution: 'color(red;green;blue).{newAtom(ben,Color)} :- color(Color).',
    output: '8 Models',
    description: 'introduction to choice rules using one constant'
},
{
    task: 'person(ben;avery).color(red;green). Use choice rules to assign all color combinations to all people.',
    tip: 'You can add another atoms elements by adding : behind be new atom and then specifying the other atom with a variable.',
    example: '{newAtom(Varable1,Varable2): atom1(Varable1)} :- atom2(Varable2).',
    solution: 'person(ben;avery).color(red;green).{newAtom(Varable1,Varable2): person(Varable1)} :- color(Varable2).',
    output: '64 Models',
    description: 'introduction to choice rules using two varaibles'
},


{
    task: 'letter(a;b).number(1;2). Create multible models where all all combinations of letter as a first element and number as the second element.',
    tip: ' Use a choice rule.',
    example: '{newAtom(Varable1,Varable2): atom1(Varable1)} :- atom2(Varable2).',
    solution: 'letter(a;b).number(1;2).{choice(Letter, Number): letter(Letter)} :- number(Number).',
    output: '16 Models',
    description: 'repeat concept of choice rules'
}, 

{
    task: 'letter(a;b).number(1;2). Make that each number only appears once in each model.',
    tip: 'you can specify the number of occurrences by = after the {}',
    example: '{newAtom(Varable1,Varable2): atom1(Varable1)} = 1 :- atom2(Varable2).',
    solution: 'letter(a;b).number(1;2).{choice(Letter, Number): letter(Letter)} = 1 :- number(Number).',
    output: '',
    description: 'introduction to = 1'

}


];