package com.crypto.staking_backend_java.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

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
