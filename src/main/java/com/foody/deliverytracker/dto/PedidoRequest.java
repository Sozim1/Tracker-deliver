package com.foody.deliverytracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class PedidoRequest {

    @NotBlank(message = "Cliente é obrigatório")
    private String cliente;

    @NotEmpty(message = "Pedido precisa ter ao menos um item")
    private List<String> itens;

    @NotBlank(message = "Endereço de entrega é obrigatório")
    private String enderecoEntrega;
}