package com.foody.deliverytracker.service;

import com.foody.deliverytracker.dto.AuthResponse;
import com.foody.deliverytracker.dto.LoginRequest;
import com.foody.deliverytracker.dto.RegisterRequest;
import com.foody.deliverytracker.model.User;
import com.foody.deliverytracker.repository.UserRepository;
import com.foody.deliverytracker.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse registrar(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        User user = new User();
        user.setNome(request.getNome());
        user.setEmail(request.getEmail());
        user.setSenha(passwordEncoder.encode(request.getSenha()));
        userRepository.save(user);

        String token = jwtUtil.gerarToken(user.getEmail());
        return new AuthResponse(token, user.getNome(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha inválidos"));

        if (!passwordEncoder.matches(request.getSenha(), user.getSenha())) {
            throw new IllegalArgumentException("E-mail ou senha inválidos");
        }

        String token = jwtUtil.gerarToken(user.getEmail());
        return new AuthResponse(token, user.getNome(), user.getEmail());
    }
}