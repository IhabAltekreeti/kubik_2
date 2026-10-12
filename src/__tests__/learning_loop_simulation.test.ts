import test from 'node:test';
import assert from 'node:assert/strict';
import { getQuestionById, getFollowUpQuestion } from '../data/questions.ts';

test('Learning Loop: Initial mistake -> Misconception identification -> Follow-up recovery', () => {
  // Step 1: Student opens LGS question
  const q1 = getQuestionById('lgs-math-01');
  assert.ok(q1);

  // Step 2: Student selects distractor D
  const studentChoice = 'D';
  const isCorrect = studentChoice === q1.trustedAnswerKey;
  assert.equal(isCorrect, false);

  const selectedOpt = q1.options.find((o) => o.id === studentChoice);
  assert.ok(selectedOpt?.misconceptionNote, 'Distractor D must have misconception diagnosis');
  assert.ok(
    selectedOpt.misconceptionNote.includes('Tabanlar aynıyken üslerin çarpılacağı yanılgısına'),
    'Should diagnose exponent multiplication error'
  );

  // Step 3: Transition to follow-up question
  const followUpQ = getFollowUpQuestion(q1.id);
  assert.ok(followUpQ, 'Follow-up question must exist');
  assert.equal(followUpQ.id, 'lgs-math-01-followup');

  // Step 4: Student solves follow-up correctly with option A
  const followUpChoice = 'A';
  const followUpIsCorrect = followUpChoice === followUpQ.trustedAnswerKey;
  assert.equal(followUpIsCorrect, true, 'Student solves follow-up correctly');

  // Step 5: Verify the learning loop record structure
  const attemptsRecord = [
    {
      questionId: q1.id,
      selectedOption: studentChoice,
      isCorrect,
      isFollowUp: false,
      detectedMisconception: selectedOpt?.misconceptionNote,
    },
    {
      questionId: followUpQ.id,
      selectedOption: followUpChoice,
      isCorrect: followUpIsCorrect,
      isFollowUp: true,
      parentQuestionId: q1.id,
    },
  ];

  assert.equal(attemptsRecord.length, 2);
  assert.equal(attemptsRecord[0].isCorrect, false);
  assert.equal(attemptsRecord[1].isCorrect, true);
  assert.equal(attemptsRecord[1].parentQuestionId, q1.id);
});

test('YKS Loop: Even function distractor analysis and solution verification', () => {
  const yksQ = getQuestionById('yks-math-01');
  assert.ok(yksQ);

  // Distractor D (confusing odd and even functions)
  const distractorOpt = yksQ.options.find((o) => o.id === 'D');
  assert.ok(distractorOpt?.misconceptionNote);
  assert.ok(distractorOpt.misconceptionNote.includes('tek fonksiyon'));

  // Correct option B
  const correctOpt = yksQ.options.find((o) => o.id === 'B');
  assert.equal(yksQ.trustedAnswerKey, 'B');
  assert.equal(correctOpt?.misconceptionNote, undefined);
});
