@Service
public class Web3Service {

    private final Web3j web3j;

    public Web3Service(@Value("${web3.rpc-url}") String rpcUrl) {
        this.web3j = Web3j.build(new HttpService(rpcUrl));
    }

    public Web3j getWeb3j() {
        return web3j;
    }
}
