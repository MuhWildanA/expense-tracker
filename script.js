const balanceEl = document.getElementById('balance')
const incomeAmountEl = document.getElementById('income-amount')
const expenseAmountEl = document.getElementById('expense-amount')
const transactionListEl = document.getElementById('transaction-list')
const transactionFormEl = document.getElementById('transaction-form')
const descriptionEl = transactionFormEl.elements['description']
const amountEl = transactionFormEl.elements['amount']


let transactions = JSON.parse(localStorage.getItem("transactions")) || []

transactionFormEl.addEventListener('submit', addTransaction)

function addTransaction(e){
    e.preventDefault()

    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value)

    transactions.push({
        id:Date.now(),
        description,
        amount        
    })

    localStorage.setItem("transactions",JSON.stringify(transactions))

    updateTransactionList()
    updateSummary()

    transactionFormEl.reset()
}

function updateTransactionList(){

    transactionListEl.innerHTML = ''

    const sortedTransaction = [...transactions].reverse()

    sortedTransaction.forEach(transaction => {
        transactionListEl.appendChild(createTransactionsElement(transaction))
    })

}

function createTransactionsElement(transaction){
    const li = document.createElement('li')
    li.classList.add('transaction')
    li.classList.add(transaction.amount > 0 ? 'income' : transaction.amount === 0 ? 'neutral' : 'expense')

    li.innerHTML = `
        <span> ${ transaction.description } </span>
        <span>
            ${formatCurrency(transaction.amount)}
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</buttom>
        </span>
    `

    return li
}

function updateSummary(){

    const balance = transactions.reduce((acc, t) => acc + t.amount, 0)
    const income = transactions.reduce((acc, t) => t.amount > 0 ? acc + t.amount: acc, 0)
    const expense = transactions.reduce((acc, t) => t.amount < 0 ? acc + t.amount: acc, 0)
    balanceEl.textContent = formatCurrency(balance)
    incomeAmountEl.textContent = formatCurrency(income)
    expenseAmountEl.textContent = formatCurrency(expense)
}

function removeTransaction(id){
    transactions = transactions.filter(t => t.id !== id)

    localStorage.setItem('transactions',JSON.stringify(transactions))
    updateTransactionList()
    updateSummary()
}

function formatCurrency(number){
    return new Intl.NumberFormat('id-ID',{
        style: "currency",
        currency: 'IDR'
    }).format(number)
}


updateTransactionList()
updateSummary()