public class Staking extends Contract {

    // If contract is already deployed, binary can be empty
    public static final String BINARY = "";

    // Paste ABI JSON as string
    public static final String ABI = "[{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"stake\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}, ...]";

    protected Staking(String contractAddress, Web3j web3j,
                      Credentials credentials, ContractGasProvider gasProvider) {
        super(ABI, contractAddress, web3j, credentials, gasProvider);
    }

    public static Staking load(String contractAddress, Web3j web3j,
                               Credentials credentials, ContractGasProvider gasProvider) {
        return new Staking(contractAddress, web3j, credentials, gasProvider);
    }
}
