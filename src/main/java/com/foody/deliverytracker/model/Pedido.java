package com.foody.deliverytracker.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cliente;

    @Column(nullable = false)
    private String enderecoEntrega;

    @ElementCollection
    @CollectionTable(name = "pedido_itens", joinColumns = @JoinColumn(name = "pedido_id"))
    @Column(name = "item")
    private List<String> itens = new ArrayList<>();
 // forma mais simples de guardar uma lista de strings sem criar uma entidade separada

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status = StatusPedido.RECEBIDO;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(nullable = false)
    private LocalDateTime atualizadoEm;

    @PrePersist
    protected void aoCriar() {
        criadoEm = LocalDateTime.now();
        atualizadoEm = LocalDateTime.now();
    } // execute este método antes de inserir no banco

    @PreUpdate
    protected void aoAtualizar() {
        atualizadoEm = LocalDateTime.now();
    } // execute este método antes de atualizar no banco
}