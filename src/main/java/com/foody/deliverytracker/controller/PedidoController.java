package com.foody.deliverytracker.controller;

import com.foody.deliverytracker.dto.PedidoRequest;
import com.foody.deliverytracker.dto.StatusUpdateRequest;
import com.foody.deliverytracker.model.Pedido;
import com.foody.deliverytracker.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<Pedido> criar(@Valid @RequestBody PedidoRequest request) {
        return ResponseEntity.ok(pedidoService.criar(request));
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> listarTodos() {
        return ResponseEntity.ok(pedidoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.buscarPorId(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Pedido> atualizarStatus(@PathVariable Long id,
                                                    @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(pedidoService.atualizarStatus(id, request.getStatus()));
    }
}