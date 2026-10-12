import test from 'node:test';
import assert from 'node:assert/strict';
import {
  safeRenderKaTeX,
  splitIntoBlocks,
  parseInlineContent,
  isLikelyMath,
} from '../utils/mathParser.ts';
import {
  SAMPLE_QUESTIONS,
  getQuestionById,
  getFollowUpQuestion,
  getQuestionsByTrack,
} from '../data/questions.ts';

// ==========================================
// 1. KA-TEX MATHEMATICAL RENDERING TESTS
// ==========================================
test('Case 1: Inline polynomial function f(x) = x^2 + 4 renders KaTeX markup', () => {
  const latex = 'f(x) = x^2 + 4';
  const rendered = safeRenderKaTeX(latex, false);
  assert.ok(rendered.includes('katex'), 'Rendered output should contain katex class');
  assert.ok(rendered.includes('x'), 'Rendered output should contain variable x');
  assert.ok(!rendered.includes('$'), 'Rendered output should not contain raw $ delimiter');
});

test('Case 2: Even function symmetry f(-x) = f(x) renders properly', () => {
  const latex = 'f(-x) = f(x)';
  const rendered = safeRenderKaTeX(latex, false);
  assert.ok(rendered.includes('katex'));
  assert.ok(rendered.includes('-'));
});

test('Case 3: Exponent multiplication rule a^n \\cdot a^m = a^{n+m} renders properly', () => {
  const latex = 'a^n \\cdot a^m = a^{n+m}';
  const rendered = safeRenderKaTeX(latex, false);
  assert.ok(rendered.includes('katex'));
  assert.ok(rendered.includes('cdot') || rendered.includes('⋅') || rendered.includes('katex-html'));
});

test('Case 4: Display mode fraction \\frac{1}{16} parses and renders in display mode', () => {
  const input = '$$\\frac{1}{16}$$';
  const blocks = splitIntoBlocks(input);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].type, 'display-math');
  const rendered = safeRenderKaTeX(blocks[0].content, true);
  assert.ok(rendered.includes('katex-display') || rendered.includes('katex'));
});

test('Case 5: Square root \\sqrt{x+1} renders properly', () => {
  const latex = '\\sqrt{x+1}';
  const rendered = safeRenderKaTeX(latex, false);
  assert.ok(rendered.includes('sqrt') || rendered.includes('katex'));
});

test('Case 6: Rational expression \\frac{x^2+1}{x-1} renders properly', () => {
  const latex = '\\frac{x^2+1}{x-1}';
  const rendered = safeRenderKaTeX(latex, false);
  assert.ok(rendered.includes('katex'));
});

test('Case 7: Bold text with inline math parses both bold and math', () => {
  const input = '**Kuralımız:** $f(x) = x^2 + 4$';
  const tokens = parseInlineContent(input);
  assert.ok(tokens.some((t) => t.type === 'bold' && t.value === 'Kuralımız:'));
  assert.ok(tokens.some((t) => t.type === 'inline-math' && t.value === 'f(x) = x^2 + 4'));
});

test('Case 8: Turkish paragraph with multiple inline formulas', () => {
  const input = 'Örneğin $a = 2$ ve $b = 3$ olduğunda toplam $a + b = 5$ bulunur.';
  const tokens = parseInlineContent(input);
  const mathTokens = tokens.filter((t) => t.type === 'inline-math');
  assert.equal(mathTokens.length, 3, 'Should parse 3 inline math tokens');
  assert.equal(mathTokens[0].value, 'a = 2');
  assert.equal(mathTokens[1].value, 'b = 3');
  assert.equal(mathTokens[2].value, 'a + b = 5');
});

test('Case 9: Multiline explanation with displayed equation splits cleanly', () => {
  const input = 'Adım 1:\n$$x^2 - 4 = 0$$\nKökler $x = \\pm 2$ bulunur.';
  const blocks = splitIntoBlocks(input);
  assert.equal(blocks.length, 3);
  assert.equal(blocks[0].type, 'text-block');
  assert.equal(blocks[1].type, 'display-math');
  assert.equal(blocks[1].content, 'x^2 - 4 = 0');
  assert.equal(blocks[2].type, 'text-block');
});

test('Case 10: Ordinary currency values like 50$ and 20$ are not treated as math', () => {
  const input = 'Kitap 50$ ve defter 20$ tuttu.';
  const tokens = parseInlineContent(input);
  const mathTokens = tokens.filter((t) => t.type === 'inline-math');
  assert.equal(mathTokens.length, 0, 'Currency dollar signs must not be parsed as math');
  const fullText = tokens.map((t) => t.value).join('');
  assert.ok(fullText.includes('50$') && fullText.includes('20$'), 'Currency symbols should remain intact');
});

test('Escaped dollar signs \\$70 are preserved as literal dollar text', () => {
  const input = 'Toplam ücret \\$70 olarak ödendi.';
  const tokens = parseInlineContent(input);
  const mathTokens = tokens.filter((t) => t.type === 'inline-math');
  assert.equal(mathTokens.length, 0);
  const fullText = tokens.map((t) => t.value).join('');
  assert.ok(fullText.includes('$70'), 'Escaped dollar should become literal $');
});

test('Numeric inline math like $20$ and $2$ and $120$ renders properly via KaTeX', () => {
  const input = 'her $20$ dakikada bir $2$ katına çıkmaktadır ($120$ dk).';
  const tokens = parseInlineContent(input);
  const mathTokens = tokens.filter((t) => t.type === 'inline-math');
  assert.equal(mathTokens.length, 3, 'All 3 numbers inside $...$ should be inline math');
  assert.equal(mathTokens[0].value, '20');
  assert.equal(mathTokens[1].value, '2');
  assert.equal(mathTokens[2].value, '120');
  assert.ok(mathTokens[0].renderedHtml?.includes('katex'));
});

// ==========================================
// 2. QUESTION BANK & PEDAGOGICAL INTEGRITY
// ==========================================
test('Every sample question has verified answer key, valid options and solution', () => {
  assert.ok(SAMPLE_QUESTIONS.length >= 6, 'Should have at least 6 sample questions');

  for (const q of SAMPLE_QUESTIONS) {
    assert.ok(q.id, 'Question must have id');
    assert.ok(q.track, 'Question must belong to a track');
    assert.ok(q.questionText.length > 10, `Question ${q.id} must have question text`);
    assert.ok(q.options.length >= 4, `Question ${q.id} must have at least 4 options`);

    const validOptionIds = q.options.map((o) => o.id);
    assert.ok(
      validOptionIds.includes(q.trustedAnswerKey),
      `Question ${q.id} trustedAnswerKey "${q.trustedAnswerKey}" must match an option`
    );

    const correctOpt = q.options.find((o) => o.id === q.trustedAnswerKey);
    assert.equal(
      correctOpt?.misconceptionNote,
      undefined,
      `Correct option in question ${q.id} must not have a misconception note`
    );

    assert.ok(q.solution.length > 20, `Question ${q.id} must have a detailed worked solution`);
    assert.equal(q.isVerified, true, `Question ${q.id} must be marked as verified`);
  }
});

test('Follow-up questions form a complete, valid transfer loop', () => {
  // LGS Main question
  const lgsQ1 = getQuestionById('lgs-math-01');
  assert.ok(lgsQ1, 'lgs-math-01 must exist');
  assert.ok(lgsQ1.followUpQuestionId, 'lgs-math-01 must have a followUpQuestionId');

  const lgsFollowUp = getFollowUpQuestion('lgs-math-01');
  assert.ok(lgsFollowUp, 'Follow-up question for lgs-math-01 must be resolvable');
  assert.equal(lgsFollowUp.id, lgsQ1.followUpQuestionId);
  assert.equal(lgsFollowUp.trustedAnswerKey, 'A');

  // YKS Main question
  const yksQ1 = getQuestionById('yks-math-01');
  assert.ok(yksQ1, 'yks-math-01 must exist');
  const yksFollowUp = getFollowUpQuestion('yks-math-01');
  assert.ok(yksFollowUp, 'Follow-up question for yks-math-01 must be resolvable');
  assert.equal(yksFollowUp.trustedAnswerKey, 'A');

  // Ara Sinif Main question
  const araQ1 = getQuestionById('ara-math-01');
  assert.ok(araQ1, 'ara-math-01 must exist');
  const araFollowUp = getFollowUpQuestion('ara-math-01');
  assert.ok(araFollowUp, 'Follow-up question for ara-math-01 must be resolvable');
  assert.equal(araFollowUp.trustedAnswerKey, 'A');
});

test('Track filtering returns only main questions, excluding follow-ups from initial lists', () => {
  const lgsQuestions = getQuestionsByTrack('LGS');
  assert.ok(lgsQuestions.length >= 2, 'Should have at least 2 main LGS questions');
  for (const q of lgsQuestions) {
    assert.ok(!q.id.includes('followup'), 'Main list must not contain follow-ups');
  }

  const yksQuestions = getQuestionsByTrack('YKS');
  assert.ok(yksQuestions.length >= 1);
  for (const q of yksQuestions) {
    assert.ok(!q.id.includes('followup'));
  }
});
