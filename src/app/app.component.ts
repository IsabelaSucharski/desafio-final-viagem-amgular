import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { CountriesService } from './countries.service';

interface Viagem {
  paisOrigem: string;
  cidadeOrigem: string;
  paisDestino: string;
  cidadeDestino: string;
  distancia: string;
  adultos: string;
  criancas: string;
  tipoDeVoo: string;
  milhas: string;
  valorAdulto: string;
  valorCrianca: string;
  valorAbatidoMilhas: string;
  total: string;
}

interface Cities {
  city: string;
  latitude: string;
  longitude: string;
}
interface Coutries {
  country: string;
  cities: Cities[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  countries: Coutries[] = [];
  cidadesOrigem: Cities[] = [];
  cidadesDestino: Cities[] = [];
  paises: string = '';
  // classe: string = '';
  criancas: number = 0;
  adultos: number = 0;

  constructor(private countriesService: CountriesService) {}
  myForm = new FormGroup({
    paisOrigem: new FormControl('Brasil'),
    cidadeOrigem: new FormControl('São Paulo'),
    paisDestino: new FormControl('Canadá'),
    cidadeDestino: new FormControl('Ottawa'),
    classe: new FormControl('economica'),
    adultos: new FormControl(0),
    criancas: new FormControl(0),
  });

  ngOnInit(): void {
    this.setValues();
  }

  setValues = () => {
    this.countriesService.get().subscribe((country: any) => {
      this.countries = country;

      let filtroPaisOrigem = country.filter((c: any) => {
        return c.country === this.myForm.get('paisOrigem')?.value;
      });

      filtroPaisOrigem.filter(({ cities }: any) => {
        this.cidadesOrigem = cities;
      });

      let filtroPaisDestino = country.filter((c: any) => {
        return c.country === this.myForm.get('paisDestino')?.value;
      });

      filtroPaisDestino.filter(({ cities }: any) => {
        this.cidadesDestino = cities;
      });
    });
  };

  origem = (value: any) => {
    let filtroPaisOrigem = this.countries.filter((c: any) => {
      return c.country === value;
    });

    filtroPaisOrigem.filter(({ cities }: any) => {
      this.cidadesOrigem = cities;
    });
  };

  destino = (value: any) => {
    let filtroPaisDestino = this.countries.filter((c: any) => {
      return c.country === value;
    });

    filtroPaisDestino.filter(({ cities }: any) => {
      this.cidadesDestino = cities;
    });
  };

  adicionarValor = (tipo: any) => {
    if (tipo === 'criancas') {
      this.criancas++;
      this.myForm.patchValue({ criancas: this.criancas });
    } else {
      this.adultos++;
      this.myForm.patchValue({ adultos: this.adultos });
    }
  };
  subtrairValor = (tipo: any) => {
    if (tipo === 'criancas') {
      this.criancas--;
      this.myForm.patchValue({ criancas: this.criancas });
    } else {
      this.adultos--;
      this.myForm.patchValue({ adultos: this.adultos });
    }
  };
}
