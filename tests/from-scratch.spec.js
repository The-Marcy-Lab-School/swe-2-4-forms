/** @jest-environment jsdom */
const fs = require('fs');
const path = require('path');
const ScoreCounter = require('score-tests');

const testSuiteName = 'From Scratch Tests';
const scoresDir = path.join(__dirname, '..', 'scores');
const scoreCounter = new ScoreCounter(testSuiteName, scoresDir);

const indexHtmlText = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');

const mockFormDataForSubmission = () => {
  // What is all this? Jest annoyingly doesn't have built in faking of form submission,
  // so we have to do it ourselves. More advanced tools will have utilities like this for us,
  // but we aren't there yet.
  const form = document.querySelector('#new-user-form');
  form.username = form.elements.username;
  form.codingLevel = form.elements.codingLevel;
  form.location = form.elements.location;
  form.didLikeAssignment = form.elements.didLikeAssignment;
};

describe(testSuiteName, () => {
  beforeEach(() => {
    document.documentElement.innerHTML = indexHtmlText;

    // Reset the module system to keep tests isolated
    jest.resetModules();
    require('../src/index'); // eslint-disable-line global-require

    scoreCounter.add(expect); // DO NOT TOUCH
  });

  it('Sets up basic html correctly', () => {
    const title = document.querySelector('head title');
    expect(title).toBeTruthy();
    expect(title.textContent).toEqual('Forms Practice');

    const main = document.querySelector('body main');
    expect(main).toBeTruthy();

    const h1 = main.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1.textContent).toEqual('Forms Practice');

    const form = document.querySelector('#new-user-form');
    expect(form).toBeTruthy();

    const resultSection = main.querySelector('section#results');
    expect(resultSection).toBeTruthy();

    const script = document.querySelector('script');
    expect(script).toBeTruthy();
    expect(script.src).toContain('index.js');

    scoreCounter.add(expect); // DO NOT TOUCH
  });

  it('form is a proper, accessible landmark with aria and heading', () => {
    const form = document.querySelector('#new-user-form');
    const formHeading = form.querySelector('form h2#form-heading');
    expect(formHeading).toBeTruthy();
    expect(formHeading.textContent).toEqual('Create A New User');
    expect(form.getAttribute('aria-labelledby')).toEqual('form-heading');

    scoreCounter.add(expect); // DO NOT TOUCH
  });

  it('has a username label and input', () => {
    const form = document.querySelector('form');
    const usernameLabel = form.querySelector('label[for="username"]');
    expect(usernameLabel).toBeTruthy();
    expect(usernameLabel.textContent).toEqual('Username:');
    expect(usernameLabel.htmlFor).toEqual('username');

    const usernameInput = form.querySelector('input#username');
    expect(usernameInput).toBeTruthy();
    expect(usernameInput.placeholder).toEqual('Add your username');
    expect(usernameInput.name).toEqual('username');
    expect(usernameInput.type).toEqual('text');

    scoreCounter.add(expect); // DO NOT TOUCH
  });

  it('has a coding level fieldset and legend', () => {
    const form = document.querySelector('form');

    const codingLevelFieldset = form.querySelector('fieldset');
    expect(codingLevelFieldset).toBeTruthy();

    const codingLevelLegend = codingLevelFieldset.querySelector('legend');
    expect(codingLevelLegend).toBeTruthy();
    expect(codingLevelLegend.textContent).toEqual('Coding Level');

    scoreCounter.add(expect); // DO NOT TOUCH
  });

  it('has radio buttons and labels, with the right default value starting checked', () => {
    const codingLevelFieldset = document.querySelector('form fieldset');

    const beginnerInput = codingLevelFieldset.querySelector('input#beginner');
    expect(beginnerInput).toBeTruthy();
    expect(beginnerInput.type).toEqual('radio');
    expect(beginnerInput.name).toEqual('codingLevel');
    expect(beginnerInput.value).toEqual('beginner');
    expect(beginnerInput.checked).toEqual(true);

    const beginnerLabel = codingLevelFieldset.querySelector('label[for="beginner"]');
    expect(beginnerLabel).toBeTruthy();
    expect(beginnerLabel.textContent).toEqual('Beginner');

    const proficientInput = codingLevelFieldset.querySelector('input#proficient');
    expect(proficientInput).toBeTruthy();
    expect(proficientInput.type).toEqual('radio');
    expect(proficientInput.name).toEqual('codingLevel');
    expect(proficientInput.value).toEqual('proficient');

    const proficientLabel = codingLevelFieldset.querySelector('label[for="proficient"]');
    expect(proficientLabel).toBeTruthy();
    expect(proficientLabel.textContent).toEqual('Proficient');

    scoreCounter.add(expect); // DO NOT TOUCH
  });

  it('has select input with label', () => {
    const form = document.querySelector('#new-user-form');

    const locationLabel = form.querySelector('label[for="location"]');
    expect(locationLabel).toBeTruthy();
    expect(locationLabel.textContent).toEqual('Location:');

    const locationSelect = form.querySelector('select#location');
    expect(locationSelect).toBeTruthy();
    expect(locationSelect.name).toEqual('location');

    scoreCounter.add(expect); // DO NOT TOUCH
  });

  it('has the right select options and values', () => {
    const locationSelect = document.querySelector('#new-user-form select#location');
    expect(locationSelect).toBeTruthy();
    expect(locationSelect.name).toEqual('location');

    const options = locationSelect.querySelectorAll('option');
    expect(options.length).toEqual(3);
    expect(options[0].value).toEqual('brooklyn');
    expect(options[0].textContent).toEqual('Brooklyn');
    expect(options[1].value).toEqual('other borough');
    expect(options[1].textContent).toEqual('Other Borough');
    expect(options[2].value).toEqual('out of state');
    expect(options[2].textContent).toEqual('Out Of State');

    scoreCounter.add(expect); // DO NOT TOUCH
  });

  it('has a checkbox input and label', () => {
    const form = document.querySelector('#new-user-form');

    const didLikeAssignmentLabel = form.querySelector('label[for="did-like-assignment"]');
    expect(didLikeAssignmentLabel).toBeTruthy();
    expect(didLikeAssignmentLabel.textContent).toEqual('Did you enjoy this assignment?');

    const didLikeAssignmentInput = form.querySelector('input#did-like-assignment');
    expect(didLikeAssignmentInput).toBeTruthy();
    expect(didLikeAssignmentInput.name).toEqual('didLikeAssignment');
    expect(didLikeAssignmentInput.type).toEqual('checkbox');

    scoreCounter.add(expect); // DO NOT TOUCH
  });

  it('has a submit button for the form', () => {
    const submitButton = document.querySelector('#new-user-form button');
    expect(submitButton).toBeTruthy();
    expect(submitButton.matches('button')).toBeTruthy();
    expect(submitButton.type).toEqual('submit');
    expect(submitButton.textContent).toEqual('Submit');

    scoreCounter.add(expect); // DO NOT TOUCH
  });

  it('Submission correctly prevents the default form behavior', () => {
    mockFormDataForSubmission();

    const form = document.querySelector('#new-user-form');

    const fakeEvent = new Event('submit');
    fakeEvent.preventDefault = jest.fn();
    form.dispatchEvent(fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Submission gets the right username and updates the result span', () => {
    mockFormDataForSubmission();
    const myUsername = 'testUsername99';

    const form = document.querySelector('#new-user-form');
    const usernameResultEl = document.querySelector('#results-username');
    form.elements.username.value = myUsername;

    const fakeEvent = new Event('submit');
    fakeEvent.preventDefault = jest.fn();
    form.dispatchEvent(fakeEvent);

    expect(usernameResultEl.textContent).toBe(myUsername);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Submission gets the right coding level and updates the result span', () => {
    mockFormDataForSubmission();
    const beginner = 'beginner';
    const proficient = 'proficient';

    const form = document.querySelector('#new-user-form');
    const codingLevelSpan = document.querySelector('#results-coding-level');
    const proficientLabel = form.querySelector('label[for="proficient"]');

    const fakeEvent = new Event('submit');
    fakeEvent.preventDefault = jest.fn();
    form.dispatchEvent(fakeEvent);

    // remember, coding level of beginner was checked by default
    expect(codingLevelSpan.textContent).toBe(beginner);

    // isn't it cool that we can just click the label and it works?
    proficientLabel.click();
    form.dispatchEvent(fakeEvent);
    expect(codingLevelSpan.textContent).toBe(proficient);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Submission gets the right location and updates the result span', () => {
    mockFormDataForSubmission();
    const brooklyn = 'brooklyn';
    const otherBorough = 'other borough';
    const outOfState = 'out of state';

    const form = document.querySelector('#new-user-form');
    const locationResultSpan = document.querySelector('#results-location');

    const fakeSubmissionEvent = new Event('submit');
    fakeSubmissionEvent.preventDefault = jest.fn();
    form.dispatchEvent(fakeSubmissionEvent);

    // brooklyn is the first value of our select so it's essentially the default
    expect(locationResultSpan.textContent).toBe(brooklyn);

    form.elements.location.value = otherBorough;
    form.dispatchEvent(fakeSubmissionEvent);
    expect(locationResultSpan.textContent).toBe(otherBorough);

    form.elements.location.value = outOfState;
    form.dispatchEvent(fakeSubmissionEvent);
    expect(locationResultSpan.textContent).toBe(outOfState);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Submission gets the right didLikeAssignment and updates the results span to Yes or No', () => {
    mockFormDataForSubmission();

    const form = document.querySelector('#new-user-form');
    const didLikeResultSpan = document.querySelector('#results-did-like-assignment');
    const didLikeAssignmentLabel = form.querySelector('label[for="did-like-assignment"]');

    const fakeEvent = new Event('submit');
    fakeEvent.preventDefault = jest.fn();
    form.dispatchEvent(fakeEvent);

    expect(didLikeResultSpan.textContent).toBe('No');

    didLikeAssignmentLabel.click();
    form.dispatchEvent(fakeEvent);
    expect(didLikeResultSpan.textContent).toBe('Yes');

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Submission resets the forms values', () => {
    mockFormDataForSubmission();

    const form = document.querySelector('#new-user-form');
    form.elements.username.value = 'testUsername99';
    form.elements.codingLevel.value = 'proficient';
    form.elements.location.value = 'out of state';
    form.elements.didLikeAssignment.checked = true;

    const fakeEvent = new Event('submit');
    fakeEvent.preventDefault = jest.fn();
    form.dispatchEvent(fakeEvent);

    form.dispatchEvent(fakeEvent);

    expect(form.elements.username.value).toBe('');
    expect(form.elements.codingLevel.value).toBe('beginner');
    expect(form.elements.location.value).toBe('brooklyn');
    expect(form.elements.didLikeAssignment.checked).toBe(false);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  afterAll(scoreCounter.export);
});
