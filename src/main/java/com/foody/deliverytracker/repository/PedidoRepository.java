package com.foody.deliverytracker.repository;

import com.foody.deliverytracker.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}