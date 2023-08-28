// Assigning necessary elements

const mainScreen = document.querySelector('#main-screen') as HTMLInputElement
const previewScreen = document.querySelector('#preview-screen')!
const allButtons = document.querySelectorAll('#button') as NodeListOf<HTMLButtonElement>
const historyToggle = document.querySelector('#history-toggle') as HTMLButtonElement
const historySection = document.querySelector('#history-section')!
const historyList = document.querySelector('#history-list') as HTMLUListElement

// Onclick for all the buttons

allButtons.forEach(button => (
  button.addEventListener('click', () => {
    if (button.value === 'clear' || button.value === 'backspace' && mainScreen.value === 'Syntax Error') {
      clearScreen()
    } else if (button.value === 'backspace') {
      backSpace()
      previewScreen.textContent = calculateExpression()
    } else if (button.value === 'equals') {
      createListItem({ expression: mainScreen.value, answer: previewScreen.textContent as string})
      logToStorage(mainScreen.value, previewScreen.textContent as string)
      mainScreen.value = calculateExpression()
      previewScreen.textContent = ''
    } else {
      mainScreen.value += button.value
      previewScreen.textContent = calculateExpression() === 'Syntax Error' ? '' : calculateExpression()
    }
  })
))

// Clears the entire screen

const clearScreen = (): void => {
  mainScreen.value = ''
  previewScreen.textContent = ''
}

// removes the last character from the expression string

const backSpace = (): void => {
  const currentValue: string = mainScreen.value

  mainScreen.value = currentValue.slice(0, currentValue.length - 1)
  previewScreen.textContent = mainScreen.value
}

// uses the eval() to calculate the string expression and also catches errors for invalid expressions

const calculateExpression = (): string => {
  if (mainScreen.value !== '') {
    try {
      const answer: string = eval(mainScreen.value)
      return answer
    } catch (err) {
      return 'Syntax Error'
    }
  }

  return ''
}

//////////////////////////////////////

// Local Storage Stuffs

interface CalculatedExpression {
  expression: string,
  answer: string
}

// Creating the local storage space

const createStorage = (): [] => {
  localStorage.setItem('Calculator History', JSON.stringify([]))

  return []
}

// Getting records in the local storage

const getCalculatorHistory = (): CalculatedExpression[] => {
  const stringified: string | null = localStorage.getItem('Calculator History')

  if (typeof stringified === 'string') {
    const history: CalculatedExpression[] = JSON.parse(stringified)

    return history
  }

  return createStorage()
}

// Adding a calculated expression to the local storage

const logToStorage = (expression: string, answer: string): void => {
  if (answer !== 'Syntax Error') {
    const newEntry: CalculatedExpression = { expression, answer }

    const history: CalculatedExpression[] = getCalculatorHistory()
    history.push(newEntry)

    const stringified = JSON.stringify(history)
    localStorage.setItem('Calculator History', stringified)
  }
}

////////////////////////

// History Section Stuff

// Toggle History Section

historyToggle.addEventListener("click", () => {
  historySection.classList.toggle('translate-y-full')
})

// Create history list item

const createListItem = (item: CalculatedExpression): void => {
  const listItem = document.createElement('li')
  listItem.className = 'flex flex-col gap-1 bg-white p-4 rounded-lg'
  historyList.appendChild(listItem)

  const expressionSpan = document.createElement('span')
  expressionSpan.className = 'font-light'
  listItem.appendChild(expressionSpan)
  expressionSpan.textContent = item.expression

  const answerSpan = document.createElement('span')
  answerSpan.className = 'text-xl'
  listItem.appendChild(answerSpan)
  answerSpan.textContent = item.answer
}

// Map over the history in the storage and populate the history list

const populateHistoryList = (): void => {
  const history: CalculatedExpression[] = getCalculatorHistory()

  history.forEach(item => (
    createListItem(item)
  ))
}

populateHistoryList()

// use the answer of a previous expression in a current expression

const listItems = document.querySelectorAll('li') as NodeListOf<HTMLLIElement>

listItems.forEach(item => (
  item.addEventListener('click', () => {
    mainScreen.value += item.lastChild?.textContent
  })
))