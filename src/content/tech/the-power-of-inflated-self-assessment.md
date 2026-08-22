---
title: "The power of inflated self-assessment"
description: "Kruger and Dunning gave undergraduates tests in humor, logic, grammar and formal reasoning, then asked them how they had done. The bottom quartile rated themselves above average in all four studies. The top quartile rated themselves below what they had scored. Both errors come from the same missing skill, and ten minutes of training moved one of them."
date: 2026-08-22
lang: en
tags:
  - Engineering culture
---

# The power of inflated self-assessment

I’ve been thinking lately about a certain behavior of people that tend to be loud and vocal. It started at work, with those colleagues who like to be seen and seem to be truly believers of the idea that having opinions on everything, regardless of their actual knowledge over the topic, is the way to be acknowledged in the form of visual recognition, mere remembrance, priority when new opportunities emerge, salary raises, or promotions.

I find it somehow exhausting when by chance I get to converse with these characters. For starters, they are loud. They use high volume as a wedge to position themselves in the conversation. They try to lead the conversation from the beginning and control the narrative. Not only that, but they constantly laugh at their own silly jokes. You know, they want to be charming and throw you nonsense analogies or odd political references that register as funny in their brains. Sometimes, I find myself mimicking their behavior, which shows how effective and powerful these tactics are and tells little of me, as the writer of this piece, how hypocritical.

After I manage to compose myself and go back to my *true self*, the next aspect that catches my eye is their lack of depth in the topics they embark on. Oversimplification: the fallacy of the single cause. Masters of casual reductionism. They don’t leave room for other points of view and jump right into their conclusion, making it really unattractive to debate. Well, that’s the thing; I don’t think they like to debate. It would take them out of their position of power and comfortable podium.

I shared this thought with a group of friends last night, and many of them realized they’ve met a lot of people behaving the same. Especially, in their professional life, not just in software engineering as is my experience. So I kept pulling that thread to try to understand whether there’s a psychological study that could explain this behavior, to not merely be prejudiced, and found quite an interesting paper by David Dunning and Justin Kruger, “Unskilled and Unaware of It: How Difficulties in Recognizing One's Own Incompetence Lead to Inflated Self-Assessments”. They ran an experiment with undergraduate students: four studies on humor, logical reasoning, grammar and [wason selection tasks](https://en.wikipedia.org/wiki/Wason_selection_task). They take a test, then estimate two things: your percentile rank relative to peers, and how many questions you got right.

Let's go through the conclusions of the experiment and look for the explanations:

1. Students in the bottom quartile (referred to in the paper as *Incompetent Individuals*) rated themselves higher than they scored, but not only that, they rated themselves above average in every one of the four studies, thus being unable to recognize they had performed poorly.
2. Students in the top quartile (referred to in the paper as *Highly Competent Individuals*) made the opposite error during their self-appraisals. They underestimated their abilities and performance relative to their peers, but they were accurate about their own raw score.

Weeks later, students from the bottom and top quartiles were brought back and given five completed tests written by their peers to grade. The instruction was to say how many questions each of the five test-takers had answered correctly.

The pattern here is that both types of individuals have a bias when self-assessing themselves relative to their peers, but only the highly competent are able to recognize their competence. The psychologist attributes this to a lack of metacognitive skills; the skills required to produce a correct answer are the same skills required to recognize a correct answer.

The behavior shown by the *highly competent individuals*, Kruger and Dunning call it *the burden of expertise*. "Just as extremely low performances are likely to be associated with slightly higher perceptions of performance, so too are extremely high performances likely to be associated with slightly lower perceptions of performance." accounting the underestimation to a regression effect ([regression toward the mean](https://en.wikipedia.org/wiki/Regression_toward_the_mean)), but let's focus on the psychological side which is what I'm trying to get here, and that's the *false-consensus effect*: they found the questions "manageable" and assumed everyone else did too.

For the Study 4, the wason selection tasks, Kruger and Dunning added a procedure that consisted in handing over a training packet  (10 minutes) to a randomly selected half of the total participants. The impact of the training packet was significantly positive on the trained bottom-quartile participants (*Incompentent Individuals*) who graded 9.3 out of 10 compared to the untrained bottom-quartile participants who graded 3.5 out of 10. Their self-assessment accuracy improved. Ten minutes of training was enough to make people better on a test they had already finished. Nothing about the test changed, only the instrument that reads the results.

The underlying topic I'm trying to address in this article is the overconfidence shown by the people who lack the skills to be correct. The behaviors I mentioned above are not applicable to every one with such character. But for the sake of this writing, I'll keep referring to the bottom-quartile (*Incompetent Individuals*) as the loud ones, which I think is less controversial than Kruger and Dunning's denotation.

In a room where engineering discussions are happening, the ones who have spent 5+ years inside a Kubernetes control plane and troubleshooting numerous incidents have no internal brain signal telling them that the upgrade path they can describe from memory is not common knowledge. They have the false-consensus error, and it manifests  as modesty rather than as a faulty behavior. They stay quiet in the design meeting because the point seems to be obvious to make, and it is obvious, but it is not for the rest of the room.

Meanwhile, the loud one(s) in that room come from the position with the least information and with real conviction, because a person who cannot see the gap between their answer and a better one will blindly and loudly go down the error path. Volume and certainty are not with competence in this scenario. They are inversely correlated with the ability to detect one's mistakes.

The authors note that people rarely receive negative feedback about their abilities in ordinary life. That is one reason why the self-appraisal miscalibration goes on after a lifetime of educative events. Telling somebody they are wrong is not the right intervention. Telling them they are experts does not make them experts. Training them is the right intervention and the right path to make them experts.
