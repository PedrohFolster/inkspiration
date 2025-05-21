package inkspiration.backend.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;

import inkspiration.backend.dto.EnderecoDTO;
import inkspiration.backend.dto.PortifolioDTO;
import inkspiration.backend.dto.ProfissionalCriacaoDTO;
import inkspiration.backend.dto.ProfissionalDTO;
import inkspiration.backend.entities.Endereco;
import inkspiration.backend.entities.Portifolio;
import inkspiration.backend.entities.Profissional;
import inkspiration.backend.entities.Usuario;
import inkspiration.backend.exception.ResourceNotFoundException;
import inkspiration.backend.exception.UsuarioException;
import inkspiration.backend.repository.EnderecoRepository;
import inkspiration.backend.repository.ProfissionalRepository;
import inkspiration.backend.repository.UsuarioRepository;

@Service
public class ProfissionalService {

    private final ProfissionalRepository profissionalRepository;
    private final UsuarioRepository usuarioRepository;
    private final EnderecoRepository enderecoRepository;
    private final PortifolioService portifolioService;
    private final UsuarioService usuarioService;
    private final DisponibilidadeService disponibilidadeService;

    @Autowired
    public ProfissionalService(ProfissionalRepository profissionalRepository, 
                              UsuarioRepository usuarioRepository,
                              EnderecoRepository enderecoRepository,
                              PortifolioService portifolioService,
                              UsuarioService usuarioService,
                              DisponibilidadeService disponibilidadeService) {
        this.profissionalRepository = profissionalRepository;
        this.usuarioRepository = usuarioRepository;
        this.enderecoRepository = enderecoRepository;
        this.portifolioService = portifolioService;
        this.usuarioService = usuarioService;
        this.disponibilidadeService = disponibilidadeService;
    }

    @Transactional
    public Profissional criar(ProfissionalDTO dto) {
        // Verifica se o usuário existe
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
            .orElseThrow(() -> new UsuarioException.UsuarioNaoEncontradoException("Usuário não encontrado"));
        
        // Verifica se já existe um profissional para este usuário
        if (profissionalRepository.existsByUsuario(usuario)) {
            throw new IllegalStateException("Já existe um perfil profissional para este usuário");
        }
        
        // Verifica se o endereço existe
        Endereco endereco = enderecoRepository.findById(dto.getIdEndereco())
            .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado com ID: " + dto.getIdEndereco()));
        
        // Cria o profissional
        Profissional profissional = new Profissional();
        profissional.setUsuario(usuario);
        profissional.setEndereco(endereco);
        
        // Define nota inicial como 0 para novos profissionais
        if (dto.getNota() == null) {
            profissional.setNota(new BigDecimal("0.0"));
        } else {
            profissional.setNota(dto.getNota());
        }
        
        return profissionalRepository.save(profissional);
    }

    @Transactional
    public Profissional atualizar(Long id, ProfissionalDTO dto) {
        Profissional profissional = buscarPorId(id);
        
        // Atualiza o endereço se o ID for fornecido
        if (dto.getIdEndereco() != null) {
            Endereco endereco = enderecoRepository.findById(dto.getIdEndereco())
                .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado com ID: " + dto.getIdEndereco()));
            profissional.setEndereco(endereco);
        }
        
        // Atualiza a nota se fornecida
        if (dto.getNota() != null) {
            profissional.setNota(dto.getNota());
        }
        
        return profissionalRepository.save(profissional);
    }
    
    /**
     * Cria um profissional completo, com portifólio e disponibilidade em uma única transação.
     * Se qualquer parte do processo falhar, toda a transação é revertida.
     * 
     * @param dto O DTO contendo todas as informações para criar o profissional e suas entidades relacionadas
     * @return O profissional criado
     * @throws JsonProcessingException Caso ocorra um erro no processamento do JSON de disponibilidade
     */
    @Transactional
    public Profissional criarProfissionalCompleto(ProfissionalCriacaoDTO dto) throws JsonProcessingException {
        // 1. Criar o profissional
        ProfissionalDTO profissionalDTO = new ProfissionalDTO();
        profissionalDTO.setIdUsuario(dto.getIdUsuario());
        profissionalDTO.setIdEndereco(dto.getIdEndereco());
        profissionalDTO.setNota(new BigDecimal("0.0")); // Nota inicial sempre zero
        
        Profissional profissional = criar(profissionalDTO);
        
        // 2. Criar o portifólio
        PortifolioDTO portifolioDTO = new PortifolioDTO();
        portifolioDTO.setIdProfissional(profissional.getIdProfissional());
        portifolioDTO.setDescricao(dto.getDescricao());
        portifolioDTO.setEspecialidade(dto.getEspecialidade());
        portifolioDTO.setExperiencia(dto.getExperiencia());
        portifolioDTO.setWebsite(dto.getWebsite());
        portifolioDTO.setTiktok(dto.getTiktok());
        portifolioDTO.setInstagram(dto.getInstagram());
        portifolioDTO.setFacebook(dto.getFacebook());
        portifolioDTO.setTwitter(dto.getTwitter());
        
        // Adicionar redes sociais se fornecidas
        if (dto.getEstilosTatuagem() != null && !dto.getEstilosTatuagem().isEmpty()) {
            // TODO: Adicionar estilos de tatuagem ao portifólio
        }
        
        Portifolio portifolio = portifolioService.criar(portifolioDTO);
        
        // 3. Criar as disponibilidades
        if (dto.getDisponibilidades() != null && !dto.getDisponibilidades().isEmpty()) {
            Map<String, Map<String, String>> horarios = new HashMap<>();
            
            // Converter do formato da API para o formato esperado pelo serviço
            dto.getDisponibilidades().forEach(dispDTO -> {
                // Implemente a lógica de conversão de DisponibilidadeDTO para o formato de mapa
                // que o DisponibilidadeService espera
                String[] partes = dispDTO.getHrAtendimento().split("-");
                if (partes.length == 3) {
                    String diaSemana = partes[0];
                    String inicio = partes[1];
                    String fim = partes[2];
                    
                    Map<String, String> horario = new HashMap<>();
                    horario.put("inicio", inicio);
                    horario.put("fim", fim);
                    
                    horarios.put(diaSemana, horario);
                }
            });
            
            disponibilidadeService.cadastrarDisponibilidade(profissional.getIdProfissional(), horarios);
        }
        
        return profissional;
    }

    public Profissional buscarPorId(Long id) {
        return profissionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado com ID: " + id));
    }
    
    public Profissional buscarPorUsuario(Long idUsuario) {
        return profissionalRepository.findByUsuario_IdUsuario(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil profissional não encontrado para o usuário com ID: " + idUsuario));
    }
    
    public boolean existePerfil(Long idUsuario) {
        return profissionalRepository.existsByUsuario_IdUsuario(idUsuario);
    }

    public Page<Profissional> listar(Pageable pageable) {
        return profissionalRepository.findAll(pageable);
    }

    @Transactional
    public void deletar(Long id) {
        Profissional profissional = buscarPorId(id);
        profissionalRepository.delete(profissional);
    }
    
    // Métodos auxiliares para conversão e atualização de entidades
    
    private Endereco converterEnderecoDTO(EnderecoDTO dto) {
        Endereco endereco = new Endereco();
        atualizarEndereco(endereco, dto);
        return endereco;
    }
    
    private void atualizarEndereco(Endereco endereco, EnderecoDTO dto) {
        endereco.setCep(dto.getCep());
        endereco.setRua(dto.getRua());
        endereco.setBairro(dto.getBairro());
        endereco.setComplemento(dto.getComplemento());
        endereco.setCidade(dto.getCidade());
        endereco.setEstado(dto.getEstado());
        endereco.setLatitude(dto.getLatitude());
        endereco.setLongitude(dto.getLongitude());
        endereco.setNumero(dto.getNumero());
    }
    
    public ProfissionalDTO converterParaDto(Profissional profissional) {
        if (profissional == null) return null;
        
        Long idEndereco = null;
        if (profissional.getEndereco() != null) {
            idEndereco = profissional.getEndereco().getIdEndereco();
        }
        
        return new ProfissionalDTO(
            profissional.getIdProfissional(),
            profissional.getUsuario().getIdUsuario(),
            idEndereco,
            profissional.getNota()
        );
    }
    
    private EnderecoDTO converterEnderecoParaDto(Endereco endereco) {
        return new EnderecoDTO(
            endereco.getIdEndereco(),
            endereco.getCep(),
            endereco.getRua(),
            endereco.getBairro(),
            endereco.getComplemento(),
            endereco.getCidade(),
            endereco.getEstado(),
            endereco.getLatitude(),
            endereco.getLongitude(),
            endereco.getNumero()
        );
    }

    // Método auxiliar para buscar endereço por ID
    private Endereco buscarEnderecoPorId(Long idEndereco) {
        return enderecoRepository.findById(idEndereco)
            .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado com ID: " + idEndereco));
    }
} 