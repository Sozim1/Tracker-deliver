package com.foody.deliverytracker.service;

import com.foody.deliverytracker.dto.PedidoRequest;
import com.foody.deliverytracker.model.Pedido;
import com.foody.deliverytracker.model.StatusPedido;
import com.foody.deliverytracker.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public Pedido criar(PedidoRequest request) {
        Pedido pedido = new Pedido();
        pedido.setCliente(request.getCliente());
        pedido.setItens(request.getItens());
        pedido.setEnderecoEntrega(request.getEnderecoEntrega());
        pedido.setStatus(StatusPedido.RECEBIDO);
        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pedido não encontrado: " + id));
    }

    public Pedido atualizarStatus(Long id, StatusPedido novoStatus) {
        Pedido pedido = buscarPorId(id);
        pedido.setStatus(novoStatus);
        return pedidoRepository.save(pedido);
    }
}