import React, { useState, useEffect } from 'react';

const CryptoTable = () => {
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedBy, setSortedBy] = useState(null); // 'marketCap' or 'priceChange'

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCryptos(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortByMarketCap = () => {
    const sortedCrypto = [...cryptos].sort((a, b) => b.market_cap - a.market_cap);
    setCryptos(sortedCrypto);
    setSortedBy('marketCap');
  };

  const handleSortByPriceChange = () => {
    const sortedCrypto = [...cryptos].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    setCryptos(sortedCrypto);
    setSortedBy('priceChange');
  };

  const renderTableRows = () => {
    const filteredCryptos = cryptos.filter((crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredCryptos.map((crypto) => (
      <tr key={crypto.id}>
        <td>{crypto.name}</td>
        <td>{crypto.symbol.toUpperCase()}</td>
        <td>${crypto.current_price}</td>
        <td>${crypto.total_volume.toLocaleString()}</td>
        <td>
          <img src={crypto.image} alt={crypto.name} style={{ width: 20, height: 20, borderRadius: '50%' }} />
        </td>
        <td>{crypto.market_cap.toLocaleString()}</td>
        <td>{crypto.price_change_percentage_24h.toFixed(2)}%</td>
      </tr>
    ));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button onClick={handleSortByMarketCap}>Sort by Market Cap</button>
      <button onClick={handleSortByPriceChange}>Sort by % Change</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price (USD)</th>
            <th>Volume (24h)</th>
            <th>Image</th>
            <th>Market Cap</th>
            <th>% Change (24h)</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
