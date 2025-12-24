import { createNewAssetRoute, deleteAssetRoute, getAllAssetsRoute, getAssetRoute, updateAssetRoute } from './assetsRoute.js';
import { createNewChainRoute, deleteChainRoute, getAllChainsRoute, getChainRoute, updateChainRoute } from './chainsRoute.js';
import { createNewCoinRoute, deleteCoinRoute, getAllCoinsRoute, getCoinRoute, getCoinsPriceRoute, updateCoinRoute, updateCoinsPriceRoute } from './coinsRoute.js';
import { createNewWalletRoute, deleteWalletRoute, getAllWalletsRoute, getWalletRoute, updateWalletRoute } from './walletsRoute.js';

export default [
    getAllChainsRoute, getChainRoute, createNewChainRoute, updateChainRoute, deleteChainRoute,
    getAllCoinsRoute, getCoinRoute, createNewCoinRoute, updateCoinRoute, updateCoinsPriceRoute, getCoinsPriceRoute, deleteCoinRoute,
    getAllWalletsRoute, getWalletRoute, createNewWalletRoute, updateWalletRoute, deleteWalletRoute,
    createNewAssetRoute, deleteAssetRoute, getAllAssetsRoute, getAssetRoute, updateAssetRoute
];