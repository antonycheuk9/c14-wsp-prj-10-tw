import express from 'express';
import { Request, Response } from 'express';

export const decisionTreeRoutes = express.Router();


class DecisionNode {
    public question: string;
    public answers: Answers;

    constructor(object: Object) {
        for (let key in object) {
            this[key] = object[key]
        }
        if (!this.question) throw ("Invalid structure");
        if (!this.answers) throw ("Invalid structure");
    }
}

class Answers {
    [choice: string]: DecisionNode | Injury | Empty;
}

class Empty {
    public end: boolean;

    constructor(object: Object) {
        for (let key in object) {
            this[key] = object[key]
        }
        if (!this.end) throw ("Invalid structure");
    }
}

class Injury {
    public injury: string;
    public end: boolean;

    constructor(object: Object) {
        for (let key in object) {
            this[key] = object[key]
        }
        if (!this.injury) throw ("Invalid structure");
        if (!this.end) throw ("Invalid structure");
    }
}

const triggerEvents: DecisionNode = new DecisionNode({
    question: "How is you pain triggered?",
    answers: {
        "Long sitting with knees bent": new Injury({
            injury: "Patellofemoral Pain Syndrome",
            end: true
        }),
        "Loading on knees (including ascending or descending walks, squats, jumping and knee hyperextension": new Injury({
            injury: "Patellar Tendinopathy",
            end: true
        }),
        "Both": new Injury({
            injury: "Patellofemoral Pain Syndrome",
            end: true
        }),

    }
})

const movability: DecisionNode = new DecisionNode({
    question: "Can you move the joint?",
    answers: {
        "yes": new Injury({
            injury: "Patellar Tendinopathy",
            end: true
        }),
        "no": new Injury({
            injury: "Patellar Tendon Tear",
            end: true
        })
    }
})

const conditions: DecisionNode = new DecisionNode({
    question: "Is it chronic or traumatic (eg. during sports)?",
    answers: {
        "chronic": triggerEvents,
        "traumatic": movability
    }
})

const anterior: DecisionNode = new DecisionNode({
    question: "Is the pain around upper or lower edge of the patella?",
    answers: {
        "upper edge": new Empty({
            end: true
        }),
        "lower edge": conditions
    }
})

const checkPopForACL: DecisionNode = new DecisionNode({
    question: "Do you hear an audible pop during the time of injury?",
    answers: {
        "yes": new Injury({
            injury: "ACL torn",
            end: true
        }),
        "no": new Injury({
            injury: "ACL sprain",
            end: true
        })
    }
})

const checkPopForMeniscal: DecisionNode = new DecisionNode({
    question: "Do you hear an audible pop during the time of injury?",
    answers: {
        "yes": new Injury({
            injury: "Meniscal torn",
            end: true
        }),
        "no": new Injury({
            injury: "Meniscal leison",
            end: true
        })
    }
})

const kneeLock: DecisionNode = new DecisionNode({
    question: "Do you feel you knee being locked when moving?",
    answers: {
        "yes": checkPopForMeniscal,
        "no": checkPopForACL
    }
})

const currentStatus: DecisionNode = new DecisionNode({
    question: "Does your joint have instability or swelling issue?",
    answers: {
        "yes": kneeLock,
        "no": new Empty({
            end: true
        })
    }
})

const inside: DecisionNode = new DecisionNode({
    question: "Is it chronic or traumatic (eg. during sports)?",
    answers: {
        "chronic": new Empty({
            end: true
        }),
        "traumatic": currentStatus
    }
})

const knee: DecisionNode = new DecisionNode({
    question: "Can you point the area out?",
    answers: {
        "left": new Empty({
            end: true
        }), "right": new Empty({
            end: true
        }), "posterior": new Empty({
            end: true
        }), "anterior": anterior, "inside": inside, "not sure/all round": new Empty({
            end: true
        })
    }
})

const lowerLimb: DecisionNode = new DecisionNode({
    question: "Which joint?",
    answers: {
        "ankle": new Empty({
            end: true
        }),
        "hip": new Empty({
            end: true
        }),
        "knee": knee
    }
})

const root: DecisionNode = new DecisionNode(
    {
        question: "Where is your pain?",
        answers: {
            "Upper limb": new Empty({
                end: true
            }),
            "Lower limb": lowerLimb
        }
    })

export function QnA(node: DecisionNode, answer: string): DecisionNode | Injury | Answers | Empty {
    // console.log("Question: ", node.question)
    // let i = 1
    // for (let choice in node.answers) {
    //     console.log(i++, ": ", choice)
    // }
    // console.log("Answer: ", answer)
    return node.answers[answer]

}

export function main(answers: string[]) {
    let node: DecisionNode | Injury | Answers | Empty = root as DecisionNode;
    let reply;
    let index = 0;
    do {
        if (node instanceof DecisionNode) {
            node = QnA(node, answers[index++]);
            if (node instanceof DecisionNode) {
                reply = node
            }
        }
        if (node instanceof Injury) {
            reply = node.injury;
            if (node.end)
                break;
        }
        if (node instanceof Empty) {
            reply = 'Sorry we cannot diagnosis';
            if (node.end)
                break;
        }
    } while (node != null && index < answers.length);
    return reply;
}

class diagnosisProcess {
    public question: string;

    constructor(object: Object) {
        for (let key in object) {
            this[key] = object[key]
        }
    }
}

export function getDiagnosis(answers: string[]) {
    let node: DecisionNode | Injury | Answers | Empty = root as DecisionNode;
    const diagnosis: diagnosisProcess = new diagnosisProcess({
    })
    let index = 0;
    do {
        if (node instanceof DecisionNode) {
            diagnosis[node.question] = answers[index];
            node = QnA(node, answers[index++]);
        }
        if (node instanceof Injury) {
            if (node.end)
                break;
        }
        if (node instanceof Empty) {
            if (node.end)
                break;
        }
    } while (node != null && index < answers.length);
    return diagnosis;
}

decisionTreeRoutes.post('/decision', async function (req: Request, res: Response) {
    const reply = main(req.body.userInput);
    const diagnosis = getDiagnosis(req.body.userInput);
    req.session['injury'] = reply;
    req.session['diagnosis'] = diagnosis;
    console.log(reply);
    console.log(diagnosis)
    res.status(200).json(reply)
})
