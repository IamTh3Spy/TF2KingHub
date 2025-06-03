// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

const STEAM_API_KEY = '075814A97EC317DBC3BA98AF053FCFEB';
const STEAM_ID64 = '76561199376164161';

app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/data', async (req, res) => {
  const profileRes = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${STEAM_ID64}`);
  const statsRes = await fetch(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?appid=440&key=${STEAM_API_KEY}&steamid=${STEAM_ID64}`);
  const achievementsRes = await fetch(`https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?appid=440&key=${STEAM_API_KEY}&steamid=${STEAM_ID64}`);
  const inventoryRes = await fetch(`https://backpack.tf/api/IGetUsersInventory/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID64}&appid=440&format=json`);

  const profile = await profileRes.json();
  const stats = await statsRes.json();
  const achievements = await achievementsRes.json();
  const inventoryData = await inventoryRes.json();

  const value = inventoryData.response?.items_value?.value || 0;
  const keys = (value / 57).toFixed(2);

  res.json({
    profile: profile.response.players[0],
    stats: stats.playerstats,
    achievements: achievements.playerstats,
    inventory: {
      value,
      keys
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
