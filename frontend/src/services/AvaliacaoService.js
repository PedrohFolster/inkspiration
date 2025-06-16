import ApiService from './ApiService';

class AvaliacaoService {
  async criarAvaliacao(idAgendamento, descricao, rating) {
    try {
      const response = await ApiService.post('/avaliacoes', {
        idAgendamento,
        descricao,
        rating
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async buscarPorId(id) {
    try {
      const response = await ApiService.get(`/avaliacoes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async listarPorUsuario(idUsuario, page = 0) {
    try {
      const response = await ApiService.get(`/avaliacoes/usuario/${idUsuario}?page=${page}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async listarPorProfissional(idProfissional, page = 0) {
    try {
      const response = await ApiService.get(`/avaliacoes/profissional/${idProfissional}?page=${page}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async atualizarAvaliacao(id, descricao, rating) {
    try {
      const response = await ApiService.put(`/avaliacoes/${id}`, {
        descricao,
        rating
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async excluirAvaliacao(id) {
    try {
      const response = await ApiService.delete(`/avaliacoes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AvaliacaoService(); 