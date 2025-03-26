# [ESL](../../../) Random Text

Version: *1.0.0-beta*.

Authors: *Alexey Stsefanovich*.

<a name="intro"></a>

**ESLRandomText** is a custom tag and utility that allows to generate random text from a given set of words `DICTIONARY`.

### Getting Started:

1. Register ESLRandomText component
```js
  import {ESLRandomText} from '@exadel/esl';
  ESLRandomText.register();
```

2. (Optionally) provide a custom dictionary using `ESLRandomText.DICTIONARY` static property:
```js
  ESLRandomText.DICTIONARY = ['word1', 'word2', 'word3'];
```

3. Add the `<esl-random-text>` custom tag and provide text limitations (with `paragraphs` and `wordsPerParagraph` attributes):
```html
  <esl-random-text paragraphs="3"></esl-random-text>
```
```html
  <esl-random-text paragraphs="1.5"></esl-random-text>
```
```html
  <esl-random-text paragraphs="10" words-per-paragraph ="5"></esl-random-text>
```

### Attributes:

- `paragraphs` \[number] - number of paragraphs to generate (can be float)
- `wordsPerParagraphs` \[number] - number of words to generate per paragraph
- `shuffle` \[boolean] - choose words randomly from the dictionary (use words in `DICTIONARY` order otherwise)


### Static API:

- `ESLRandomText.DICTIONARY` - static property that contains a dictionary of words to generate random text from.
  "Lorem ipsum" is used by default.

- `ESLRandomText.WORDS_PER_PARAGRAPH` - static property that contains a default number of words per paragraph.
  100 is used by default.

- `ESLRandomText.WORDS_PER_SENTENCE` - static property that contains a default number of words per single sentence.
  10 is used by default.

- `ESLRandomText.generateText(words, shuffle)` - static method that generates random text from the dictionary.
  Returns a string with `words` number of words. If `shuffle` is `true` words are chosen randomly from the dictionary.
  Otherwise, words are chosen in the dictionary order.

- `ESLRandomText.generateTextHTML(words, wordsPerParagraph, shuffle)` - static method that generates random text from the dictionary.
  Returns an HTML string with `words` number of words and `wordsPerParagraph` number of words per paragraph.
  If `shuffle` is `true` words are chosen randomly from the dictionary. Otherwise, words are chosen in the dictionary order.
