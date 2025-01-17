<template>
    <h1>Furvault</h1>
    <p class="mb-5">Earn up to 2.5% daily rewards by depositing in to the Furvault.</p>
    <div class="row flex-row-reverse gx-5">
        <div class="col-lg-7 bg-light text-dark rounded p-5 mb-4">
            <div v-show="!loading && !statusDrop && !maxed">
                <div class="form-group">
                    <label for="quantity">Deposit $FUR</label>
                    <input v-model="quantity" type="number" class="form-control" id="quantity"/>
                </div>
                <div v-show="showReferrer" class="form-group">
                    <label for="referrer">Referrer</label>
                    <input v-model="referrer" class="form-control" id="referrer"/>
                </div>
                <button @click="deposit" class="btn btn-lg btn-info btn-block mb-2">Deposit</button>
                <div class="row mt-3">
                    <div class="col-6">
                        <button @click="compound" class="btn btn-lg btn-info btn-block">Compound {{ availableDisplay }}</button>
                    </div>
                    <div class="col-6">
                        <button @click="claim" class="btn btn-lg btn-secondary btn-block">Claim {{ availableDisplay }}</button>
                    </div>
                </div>
                <div class="text-right mt-3">
                    <button @click="toggleAutoCompound" class="btn btn-link">Auto Compound</button>
                </div>
                <div v-show="showAutoCompound" class="mt-3">
                    <div v-show="autocompoundFull" class="alert alert-danger" role="alert">The autocompound contract is currently full. Please try again later.</div>
                    <div v-show="!autocompoundFull">
                        <hr/>
                        <div class="alert alert-danger" role="alert"><strong>WARNING:</strong> The auto compound feature is currently in <strong>beta</strong>. Use at your own risk!</div>
                        <div class="form-group">
                            <label for="auto-compound-periods">Periods</label>
                            <input v-model="autoCompoundPeriods" class="form-control" type="number" id="auto-compound-periods"/>
                        </div>
                        <button @click="autoCompound" class="btn btn-lg btn-info btn-block">Auto Compound</button>
                    </div>
                </div>
                <div class="text-right mt-3">
                    <button @click="toggleVaultStats" class="btn btn-link">Vault Statistics</button>
                </div>
                <div v-show="showVaultStats" class="mt-5">
                    <hr/>
                    <h5 class="text-center">Vault Statistics</h5>
                    <table class="table table-striped">
                        <tbody>
                            <tr>
                                <td>&nbsp;</td>
                                <th scope="col">Count</th>
                                <th scope="col">Value</th>
                            </tr>
                            <tr>
                                <th scope="row">Participants</th>
                                <td>{{ getStat("totalParticipants") }}</td>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <th scope="row">Deposits</th>
                                <td>{{ getStat("totalDeposits") }}</td>
                                <td>{{ displayCurrency.format(getStat("totalDeposited")) }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Compounds</th>
                                <td>{{ getStat("totalCompounds") }}</td>
                                <td>{{ displayCurrency.format(getStat("totalCompounded")) }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Claims</th>
                                <td>{{ getStat("totalClaims") }}</td>
                                <td>{{ displayCurrency.format(getStat("totalClaimed")) }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Airdrops</th>
                                <td>{{ getStat("totalAirdrops") }}</td>
                                <td>{{ displayCurrency.format(getStat("totalAirdropped")) }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Referral Rewards</th>
                                <td>{{ getStat("totalBonuses") }}</td>
                                <td>{{ displayCurrency.format(getStat("totalBonused")) }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Taxes</th>
                                <td>{{ getStat("totalTaxed") }}</td>
                                <td>{{ displayCurrency.format(getStat("totalTaxes")) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-show="!loading && !statusDrop && maxed">
                <p><strong>Congratulations</strong> on maxing our your rewards! Why not send some of your earnings to another wallet and start again?</p>
                <div v-show="complete" class="alert alert-primary">
                    You have claimed your maximum amount of rewards!
                </div>
                <div v-show="!complete">
                    <button @click="claim" class="btn btn-lg btn-info btn-block">Claim {{ availableDisplay }}</button>
                </div>
            </div>
            <div v-show="!loading && statusDrop">
                <p>Claiming now will lower your reward rate from <strong>{{ rewardRate }}%</strong> to <strong>{{ newRewardRate }}%</strong>. Are you <strong><em>sure</em></strong> you want to continue?</p>
                <div class="row">
                    <div class="col-sm-6">
                        <button @click="cancel" class="btn btn-lg btn-info btn-block mb-2">Cancel</button>
                    </div>
                    <div class="col-sm-6">
                        <button @click="claim" class="btn btn-lg btn-danger btn-block mb-2">Continue</button>
                    </div>
                </div>
            </div>
            <div v-show="loading" class="text-center">
                <div class="spinner-border m-5" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
        <div class="col-lg-5">
            <div class="row">
                <div class="col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <img src="../../images/fur.svg" class="mx-auto d-block mb-3" alt="FUR" width="75" height="75"/>
                            <p class="card-title">Balance</p>
                            <p class="card-text"><strong>{{ depositedDisplay }} $FUR</strong></p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <img src="../../images/fur.svg" class="mx-auto d-block mb-3" alt="FUR" width="75" height="75"/>
                            <p class="card-title">Claimed</p>
                            <p class="card-text"><strong>{{ claimedDisplay }} $FUR</strong></p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <img src="../../images/reward-rate.svg" class="mx-auto d-block mb-3" alt="Reward Rate" width="75" height="75"/>
                            <p class="card-title">Reward Rate</p>
                            <p class="card-text"><strong>{{ rewardRate }}%</strong></p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <img src="../../images/referral.svg" class="mx-auto d-block mb-3" alt="Participant" width="75" height="75"/>
                            <p class="card-title">Participant Status</p>
                            <p class="card-text"><strong>{{ participantStatusDisplay }}</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex';
import useAlerts from '../composables/useAlerts';
import useBalances from '../composables/useBalances';
import useDisplayCurrency from '../composables/useDisplayCurrency';

export default {
    setup () {
        const store = useStore();
        const alerts = useAlerts();
        const balances = useBalances();
        const displayCurrency = useDisplayCurrency();
        const rewardRate = ref(0);
        const newRewardRate = ref(0);
        const available = ref(0);
        const participantStatus = ref(0);
        const quantity = ref(0);
        const balance = ref(0);
        const loading = ref(false);
        const statusDrop = ref(false);

        const stats = ref(null);
        const properties = ref(null);
        const participant = ref(null);
        const referrer = ref(null);
        const ac = ref({
            stats: {
                compounding: 0,
                compounds: 0,
            },
            properties: {
                maxPeriods: 0,
                period: 0,
                fee: 0,
                maxParticipants: 0,
            },
            isCompounding: false,
            remainingCompounds: 0,
            lastCompound: 0,
            totalCompounds: 0,
        });

        const showAutoCompound = ref(false);
        const autoCompoundPeriods = ref(0);
        const autocompoundStats = ref({
            compounding: 0,
            compounds: 0,
        });
        const autocompoundProperties = ref({
            maxPeriods: 0,
            period: 0,
            fee: 0,
            maxParticipants: 0,
        });

        const showVaultStats = ref(null);

        const depositedDisplay = computed(() => {
            if(!participant.value) {
                return 0;
            }
            return displayCurrency.format(participant.value.balance);
        });

        const claimedDisplay = computed(() => {
            if(!participant.value) {
                return 0;
            }
            return displayCurrency.format(participant.value.claimed);
        });

        const availableDisplay = computed(() => {
            if(!available.value) {
                return 0;
            }
            return displayCurrency.format(available.value);
        });

        const showReferrer = computed(() => {
            if(!participant.value) {
                return false;
            }
            return participant.value.referrer == "0x0000000000000000000000000000000000000000";
        });

        const participantStatusDisplay = computed(() => {
            switch(participantStatus.value) {
                case "1":
                    return 'Negative';
                case "2":
                    return 'Neutral';
                case "3":
                    return 'Positive';
            }
        });

        const maxed = computed(() => {
            if(!participant.value) {
                return false;
            }
            return participant.value.maxed;
        });

        const complete = computed(() => {
            if(!participant.value) {
                return false;
            }
            return participant.value.complete;
        });

        const autocompoundFull = computed(() => {
            return autocompoundStats.value.compounding >= autocompoundProperties.value.maxParticipants;
        });

        addEventListener("refresh", async () => {
            await update();
        });

        onMounted(async () => {
            await update();
        });

        const update = async () => {
            loading.value = true;
            try {
                const contract = vaultContract();
                stats.value = await contract.methods.getStats().call();
                properties.value = await contract.methods.getProperties().call();
                participant.value = await contract.methods.getParticipant(store.state.wallet.address).call();
                rewardRate.value = await contract.methods.rewardRate(store.state.wallet.address).call() / 100;
                available.value = await contract.methods.availableRewards(store.state.wallet.address).call();
                participantStatus.value = await contract.methods.participantStatus(store.state.wallet.address).call();
                if(participant.value.referrer != "0x0000000000000000000000000000000000000000") {
                    referrer.value = participant.value.referrer;
                }
                const token = tokenContract();
                balance.value = await token.methods.balanceOf(store.state.wallet.address).call();
                const autocompound = autocompoundContract();
                autocompoundStats.value = await autocompound.methods.stats().call();
                autocompoundProperties.value = await autocompound.methods.properties().call();
                console.log(participant.value);
                await axios.post("/api/v1/vault", {
                    address: store.state.wallet.address,
                    start_time: participant.value.startTime,
                    balance: participant.value.balance,
                    deposited: participant.value.deposited,
                    compounded: participant.value.compounded,
                    claimed: participant.value.claimed,
                    taxed: participant.value.taxed,
                    awarded: participant.value.awarded,
                    negative: participant.value.negative,
                    penalized: participant.value.penalized,
                    maxed: participant.value.maxed,
                    banned: participant.value.banned,
                    team_wallet: participant.value.teamWallet,
                    complete: participant.value.complete,
                    maxed_rate: participant.value.maxedRate,
                    direct_referrals: participant.value.directReferrals,
                    airdrop_sent: participant.value.airdropSent,
                    airdrop_received: participant.value.airdropReceived,
                }).catch(error => {
                    alerts.danger(error.message);
                })
            } catch (error) {
                alerts.danger(error.message);
            }
            balances.refresh();
            loading.value = false;
        }

        const vaultContract = () => {
            return new web3.eth.Contract(JSON.parse(store.state.settings.vault_abi), store.state.settings.vault_address);
        }

        const tokenContract = () => {
            return new web3.eth.Contract(JSON.parse(store.state.settings.token_abi), store.state.settings.token_address);
        }

        const autocompoundContract = () => {
            return new web3.eth.Contract(JSON.parse(store.state.settings.autocompound_abi), store.state.settings.autocompound_address);
        }

        const deposit = async () => {
            alerts.warning("waiting on response from wallet");
            loading.value = true;
            try {
                const contract = vaultContract();
                const token = tokenContract();
                const gasPriceMultiplier = 1;
                const gasMultiplier = 1.5;
                const gasPrice = Math.round(await web3.eth.getGasPrice() * gasPriceMultiplier);
                const amount = BigInt(quantity.value * 1000000000000000000);
                const allowance = await token.methods.allowance(store.state.wallet.address, store.state.settings.vault_address).call();
                if(allowance < amount) {
                    const approveGas = Math.round(await token.methods.approve(store.state.settings.vault_address, amount).estimateGas({ from: store.state.wallet.address, gasPrice: gasPrice }) * gasMultiplier);
                    await token.methods.approve(store.state.settings.vault_address, amount).send({ from: store.state.wallet.address, gasPrice: gasPrice, gas: approveGas });
                }
                let result;
                if(referrer.value) {
                    const gas = Math.round(await contract.methods.deposit(amount, referrer.value).estimateGas({ from: store.state.wallet.address, gasPrice: gasPrice }) * gasMultiplier);
                    result = await contract.methods.deposit(amount, referrer.value).send({ from: store.state.wallet.address, gasPrice: gasPrice, gas: gas });
                } else {
                    const gas = Math.round(await contract.methods.deposit(amount).estimateGas({ from: store.state.wallet.address, gasPrice: gasPrice }) * gasMultiplier);
                    result = await contract.methods.deposit(amount).send({ from: store.state.wallet.address, gasPrice: gasPrice, gas: gas });
                }
                alerts.info("Transaction successful! TXID: " + result.blockHash);
            } catch (error) {
                alerts.danger(error.message);
            }
            dispatchEvent(new Event("refresh"));
            await update();
            loading.value = false;
        }

        const compound = async () => {
            alerts.warning("waiting on response from wallet");
            loading.value = true;
            try {
                const contract = vaultContract();
                const gasPriceMultiplier = 1;
                const gasMultiplier = 1.2;
                const gasPrice = Math.round(await web3.eth.getGasPrice() * gasPriceMultiplier);
                const gas = Math.round(await contract.methods.compound().estimateGas({ from: store.state.wallet.address, gasPrice: gasPrice }) * gasMultiplier);
                const result = await contract.methods.compound().send({ from: store.state.wallet.address, gasPrice: gasPrice, gas: gas });
                alerts.info("Transaction successful! TXID: " + result.blockHash);
            } catch (error) {
                alerts.danger(error.message);
            }
            dispatchEvent(new Event("refresh"));
            await update();
            loading.value = false;
        }

        const claim = async () => {
            try {
                const contract = vaultContract();
                if(!participant.value.maxed) {
                    newRewardRate.value = await contract.methods.claimPrecheck(store.state.wallet.address).call() / 100;
                    if(newRewardRate.value < rewardRate.value && !statusDrop.value) {
                        statusDrop.value = true;
                        return;
                    }
                }
                alerts.warning("waiting on response from wallet");
                loading.value = true;
                const gasPriceMultiplier = 1;
                const gasMultiplier = 1.2;
                const gasPrice = Math.round(await web3.eth.getGasPrice() * gasPriceMultiplier);
                const gas = Math.round(await contract.methods.claim().estimateGas({ from: store.state.wallet.address, gasPrice: gasPrice }) * gasMultiplier);
                const result = await contract.methods.claim().send({ from: store.state.wallet.address, gasPrice: gasPrice, gas: gas });
                alerts.info("Transaction successful! TXID: " + result.blockHash);
            } catch (error) {
                alerts.danger(error.message);
            }
            dispatchEvent(new Event("refresh"));
            await update();
            statusDrop.value = false;
            loading.value = false;
        }

        const cancel = () => {
            statusDrop.value = false;
        }

        const getStat = (stat) => {
            if(!stats.value) {
                return null;
            }
            if(!stats.value[stat]) {
                return null;
            }
            return stats.value[stat];
        }

        const toggleAutoCompound = async () => {
            loading.value = true;
            try {
                const autocompound = autocompoundContract();
                ac.value.stats = await autocompound.methods.stats().call();
                ac.value.properties = await autocompound.methods.properties().call();
                ac.value.isCompounding = await autocompound.methods.compounding(store.state.wallet.address).call();
                if(ac.value.isCompounding) {
                    ac.value.remainingCompounds = await autocompound.methods.compoundsLeft(store.state.wallet.address).call();
                    ac.value.lastCompound = await autocompound.methods.lastCompound(store.state.wallet.address).call();
                    ac.value.totalCompounds = await autocompound.methods.totalCompounds(store.state.wallet.address).call();
                }
                console.log(ac);
                showAutoCompound.value = !showAutoCompound.value;
            } catch (error) {
                alerts.danger(error.message);
            }
            loading.value = false;
        }

        const autoCompound = async () => {
            if(autoCompoundPeriods.value < 1) {
                alerts.danger("Periods must be greater than zero");
                return;
            }
            try {
                loading.value = true;
                const autocompound = autocompoundContract();
                const autocompoundProperties = await autocompound.methods.properties().call();
                console.log(autocompoundProperties);
                if(autoCompoundPeriods.value > autocompoundProperties.maxPeriods) {
                    alerts.danger("Periods cannot be greater than " + autocompoundProperties.maxPeriods);
                    loading.value = false;
                    return;
                }
                const price = autoCompoundPeriods.value * autocompoundProperties.fee;
                const gasPriceMultiplier = 1;
                const gasMultiplier = 1.2;
                const gasPrice = Math.round(await web3.eth.getGasPrice() * gasPriceMultiplier);
                const gas = Math.round(await autocompound.methods.start(autoCompoundPeriods.value).estimateGas({ from: store.state.wallet.address, value: price, gasPrice: gasPrice }) * gasMultiplier);
                const result = await autocompound.methods.start(autoCompoundPeriods.value).send({ from: store.state.wallet.address, value: price, gasPrice: gasPrice, gas: gas });
                alerts.info("Transaction successful! TXID: " + result.blockHash);
            } catch (error) {
                alerts.danger(error.message);
            }
            loading.value = false;
        }

        const toggleVaultStats = () => {
            showVaultStats.value = !showVaultStats.value;
        }

        return {
            quantity,
            depositedDisplay,
            claimedDisplay,
            rewardRate,
            newRewardRate,
            available,
            availableDisplay,
            participantStatus,
            participantStatusDisplay,
            showReferrer,
            referrer,
            deposit,
            compound,
            claim,
            cancel,
            loading,
            statusDrop,
            stats,
            properties,
            participant,
            maxed,
            complete,
            getStat,
            displayCurrency,
            showVaultStats,
            toggleVaultStats,
            showAutoCompound,
            toggleAutoCompound,
            autoCompoundPeriods,
            autoCompound,
            autocompoundFull,
            ac,
        }
    }
}
</script>
