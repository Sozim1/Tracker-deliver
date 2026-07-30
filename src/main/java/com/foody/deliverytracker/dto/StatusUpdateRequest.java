package com.foody.deliverytracker.dto;

import com.foody.deliverytracker.model.StatusPedido;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {

    @NotNull(message = "Status é obrigatório")
    private StatusPedido status;
}