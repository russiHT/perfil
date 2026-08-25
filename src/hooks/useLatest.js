import { useEffect, useRef } from 'react';

/**
 * Mantém um ref sempre apontando para o valor mais recente.
 *
 * Serve para o caso em que um callback de longa duração (um setInterval, um
 * listener global, o callback do player do YouTube) precisa ler um valor atual
 * sem que a criação desse callback dependa do valor — o que o destruiria e
 * recriaria a cada render.
 *
 * A escrita acontece dentro de um efeito, e não durante o render: escrever em
 * refs enquanto o componente renderiza não é seguro sob renderização
 * concorrente (é o que a regra react-hooks/refs sinaliza).
 */
export function useLatest(value) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref;
}

export default useLatest;
