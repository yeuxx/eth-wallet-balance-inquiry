function formatNumber(number) {
    return number.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getBalances() {
    var walletAddress = document.getElementById('walletAddress').value.trim();
    var apiKey = ''; // Etherscan API anahtarını buraya girin , gerek yok sanki 
    
    // Ethereum bakiyesi için API URL
    var ethApiUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${apiKey}`;

    // USDT (Tether) bakiyesi için API URL
    var usdtContractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'; // USDT token contract adresi
    var usdtApiUrl = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${usdtContractAddress}&address=${walletAddress}&tag=latest&apikey=${apiKey}`;

    // ETH bakiyesi al
    fetch(ethApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === "1") {
                var ethBalance = data.result / Math.pow(10, 18); // Wei cinsinden gelen bakiyeyi ETH'ye çevirme

                // USDT bakiyesi al
                fetch(usdtApiUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "1") {
                            var usdtBalance = data.result / Math.pow(10, 6); // Wei cinsinden gelen bakiyeyi USDT'ye çevirme

                            // Sonuçları göster
                            displayBalances(ethBalance, usdtBalance);
                        } else {
                            displayError('USDT bakiyesi alınamadı');
                        }
                    })
                    .catch(error => {
                        console.error('USDT bakiye bilgileri alınamadı', error);
                        displayError('USDT bakiye bilgileri alınamadı');
                    });

            } else {
                displayError('ETH bakiyesi alınamadı');
            }
        })
        .catch(error => {
            console.error('ETH bakiye bilgileri alınamadı', error);
            displayError('ETH bakiye bilgileri alınamadı');
        });
}

function displayBalances(ethBalance, usdtBalance) {
    var formattedEthBalance = formatNumber(ethBalance);
    var formattedUsdtBalance = formatNumber(usdtBalance);

    var tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Varlık</th>
                    <th>Bakiye</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Ethereum (ETH)</td>
                    <td><span class="bold">${formattedEthBalance} ETH</span></td>
                </tr>
                <tr>
                    <td>USDT (Tether)</td>
                    <td><span class="bold blue">${formattedUsdtBalance} USDT</span></td>
                </tr>
            </tbody>
        </table>
    `;

    document.getElementById('balanceResult').innerHTML = tableHtml;
}

function displayError(message) {
    document.getElementById('balanceResult').innerHTML = `<p>${message}. Lütfen daha sonra tekrar deneyin.</p>`;
}
